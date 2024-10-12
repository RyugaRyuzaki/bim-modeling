import * as THREE from "three";
import {
  buildTree,
  generateIndirectBuffer,
} from "three-mesh-bvh/src/core/build/buildTree";
import {BYTES_PER_NODE} from "three-mesh-bvh/src/core/Constants.js";

import {
  countNodes,
  populateBuffer,
} from "three-mesh-bvh/src/core/build/buildUtils.js";
import {computeTriangleBounds} from "three-mesh-bvh/src/core/build/computeBoundsUtils.js";
import {
  getFullGeometryRange,
  getRootIndexRanges,
  getTriCount,
} from "three-mesh-bvh/src/core/build/geometryUtils.js";
import {DEFAULT_OPTIONS} from "three-mesh-bvh/src/core/MeshBVH.js";
import {WorkerPool} from "three-mesh-bvh/src/workers/utils/WorkerPool.js";

let isRunning = false;
let prevTime = 0;

const workerPool = new WorkerPool(
  () =>
    new Worker(new URL("./parallelMeshBVH.worker.js", import.meta.url), {
      type: "module",
    })
);

self.onmessage = async (e: MessageEvent) => {
  const data = e.data;
  const {operation} = data;

  if (operation === "BUILD_BVH") {
    isRunning = true;

    const {maxWorkerCount, index, position, options} = data;

    // initialize the number of workers balanced for a binary tree
    workerPool.setWorkerCount(THREE.MathUtils.floorPowerOfTwo(maxWorkerCount));

    // generate necessary buffers and objects
    const geometry = getGeometry(index, position);
    const geometryRanges = options.indirect
      ? getFullGeometryRange(geometry)
      : getRootIndexRanges(geometry);
    const indirectBuffer = options.indirect
      ? generateIndirectBuffer(geometry, true)
      : null;
    const triCount = getTriCount(geometry);
    const triangleBounds = new Float32Array(
      new SharedArrayBuffer(triCount * 6 * 4)
    );

    // generate portions of the triangle bounds buffer over multiple frames
    const boundsPromises = [];
    for (let i = 0, l = workerPool.workerCount; i < l; i++) {
      const countPerWorker = Math.ceil(triCount / l);
      const offset = i * countPerWorker;
      const count = Math.min(countPerWorker, triCount - offset);

      boundsPromises.push(
        //@ts-ignore
        workerPool.runSubTask(i, {
          operation: "BUILD_TRIANGLE_BOUNDS",
          offset,
          count,
          index,
          position,
          triangleBounds,
        })
      );
    }

    await Promise.all(boundsPromises);

    // create a proxy bvh structure
    const proxyBvh = {
      _indirectBuffer: indirectBuffer,
      geometry: geometry,
    };

    let totalProgress = 0;

    const localOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
      verbose: false,
      maxDepth: Math.round(Math.log2(workerPool.workerCount)),
      onProgress: options.includedProgressCallback
        ? getOnProgressDeltaCallback((delta) => {
            totalProgress += 0.1 * delta;
            triggerOnProgress(totalProgress);
          })
        : null,
    };

    // generate the ranges for all roots asynchronously
    const packedRoots = [];
    for (let i = 0, l = geometryRanges.length; i < l; i++) {
      // build the tree down to the necessary depth
      const promises = [];
      const range = geometryRanges[i];
      const root = buildTree(
        proxyBvh,
        triangleBounds,
        range.offset,
        range.count,
        localOptions
      );
      const flatNodes = flattenNodes(root);
      let bufferLengths = 0;
      let remainingNodes = 0;
      let nextWorker = 0;

      // trigger workers for each generated leaf node
      for (let j = 0, l = flatNodes.length; j < l; j++) {
        const node = flatNodes[j];
        //@ts-ignore
        const isLeaf = Boolean(node.count);
        if (isLeaf) {
          // adjust the maxDepth to account for the depth we've already traversed
          const workerOptions = {
            ...DEFAULT_OPTIONS,
            ...options,
          };
          //@ts-ignore

          workerOptions.maxDepth = workerOptions.maxDepth - node.depth;

          const pr = workerPool
            .runSubTask(
              nextWorker++,
              {
                operation: "BUILD_SUBTREE",
                //@ts-ignore

                offset: node.offset,
                //@ts-ignore

                count: node.count,
                indirectBuffer,
                index,
                position,
                triangleBounds,
                options: workerOptions,
              },
              getOnProgressDeltaCallback((delta) => {
                totalProgress += (0.9 * delta) / nextWorker;
                triggerOnProgress(totalProgress);
              })
            )
            .then((data) => {
              const buffer = data.buffer;
              //@ts-ignore

              node.buffer = buffer;
              bufferLengths += buffer.byteLength;
            });
          //@ts-ignore
          promises.push(pr);
        } else {
          remainingNodes++;
        }
      }

      // wait for the sub trees to complete
      await Promise.all(promises);

      const BufferConstructor = options.useSharedArrayBuffer
        ? SharedArrayBuffer
        : ArrayBuffer;
      const buffer = new BufferConstructor(
        bufferLengths + remainingNodes * BYTES_PER_NODE
      );
      populateBuffer(0, root, buffer);

      //@ts-ignore
      packedRoots.push(buffer);
    }

    // transfer the data back
    self.postMessage({
      error: null,
      serialized: {
        roots: packedRoots,
        index: index,
        indirectBuffer: indirectBuffer,
      },
      position,
      progress: 1,
    });

    isRunning = false;
  } else if (operation === "BUILD_SUBTREE") {
    const {
      offset,
      count,
      indirectBuffer,
      index,
      position,
      triangleBounds,
      options,
    } = data;

    const proxyBvh = {
      _indirectBuffer: indirectBuffer,
      geometry: getGeometry(index, position),
    };

    const localOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
      onProgress: options.includedProgressCallback ? triggerOnProgress : null,
    };

    const root = buildTree(
      proxyBvh,
      triangleBounds,
      offset,
      count,
      localOptions
    );
    const nodeCount = countNodes(root);
    const buffer = new ArrayBuffer(BYTES_PER_NODE * nodeCount);
    populateBuffer(0, root, buffer);
    //@ts-ignore
    self.postMessage({type: "result", buffer, progress: 1}, [buffer]);
  } else if (operation === "BUILD_TRIANGLE_BOUNDS") {
    const {index, position, triangleBounds, offset, count} = data;

    const geometry = getGeometry(index, position);
    computeTriangleBounds(geometry, triangleBounds, offset, count);
    self.postMessage({type: "result"});
  } else if (operation === "REFIT") {
    // TODO
  } else if (operation === "REFIT_SUBTREE") {
    // TODO
  }
};

// Helper functions and utils
function getOnProgressDeltaCallback(cb) {
  let lastProgress = 0;
  return function onProgressDeltaCallback(progress) {
    cb(progress - lastProgress);
    lastProgress = progress;
  };
}

function triggerOnProgress(progress) {
  // account for error
  progress = Math.min(progress, 1);

  const currTime = performance.now();
  if (currTime - prevTime >= 10 && progress !== 1.0) {
    self.postMessage({
      error: null,
      progress,
      type: "progress",
    });
    prevTime = currTime;
  }
}

function getGeometry(index, position) {
  const geometry = new THREE.BufferGeometry();
  if (index) {
    geometry.index = new THREE.BufferAttribute(index, 1, false);
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  return geometry;
}

function flattenNodes(node) {
  const arr = [];
  traverse(node);
  return arr;

  function traverse(node, depth = 0) {
    node.depth = depth;
    //@ts-ignore
    arr.push(node);

    const isLeaf = Boolean(node.count);
    if (!isLeaf) {
      traverse(node.left, depth + 1);
      traverse(node.right, depth + 1);
    }
  }
}
