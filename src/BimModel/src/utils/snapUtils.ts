import * as THREE from "three";
export interface ISnapEdge {
  distance: number;
  points: THREE.Vector3[];
}

export class SnapUtils {
  /**
   *
   * @param index number
   * @param vertices THREE.BufferAttribute
   * @returns THREE.Vector3
   */
  static getVertex(
    index: number,
    vertices: THREE.BufferAttribute
  ): THREE.Vector3 | null {
    return new THREE.Vector3(
      vertices.getX(index),
      vertices.getY(index),
      vertices.getZ(index)
    );
  }
  /**
   *
   * @param face  THREE.Face
   * @param vertices  THREE.BufferAttribute
   * @returns
   */
  static getVerticesMesh(
    face: THREE.Face,
    vertices: THREE.BufferAttribute
  ): THREE.Vector3[] {
    const {a, b, c} = face;
    return [
      this.getVertex(a, vertices)!,
      this.getVertex(b, vertices)!,
      this.getVertex(c, vertices)!,
    ];
  }
  /**
   *
   * @param start
   * @param end
   * @returns
   */
  static getMiddlePoint(start: THREE.Vector3, end: THREE.Vector3) {
    return new THREE.Vector3().lerpVectors(start, end, 0.5);
  }
  /**
   *
   * @param p1  THREE.Vector3
   * @param p2 THREE.Vector3
   * @param p3 THREE.Vector3
   * @returns THREE.Vector3
   */
  static getProjectPointFrom3Point(
    p1: THREE.Vector3,
    p2: THREE.Vector3,
    p3: THREE.Vector3
  ) {
    const v1 = new THREE.Vector3(
      p2.x - p1.x,
      p2.y - p1.y,
      p2.z - p1.z
    ).normalize();
    const v2 = new THREE.Vector3(
      p3.x - p1.x,
      p3.y - p1.y,
      p3.z - p1.z
    ).normalize();
    return p1
      .clone()
      .add(
        v1.clone().multiplyScalar(p1.distanceTo(p3) * Math.cos(v1.angleTo(v2)))
      );
  }
  /**
   *
   * @param points THREE.Vector3[]
   * @returns THREE.Vector3[]
   */
  static getMiddlePointsOfTriangleMesh(points: THREE.Vector3[]) {
    if (points.length !== 3) return [];
    const ps: THREE.Vector3[] = [];
    for (let i = 0; i < points.length; i++) {
      if (i === points.length - 1) {
        ps.push(this.getMiddlePoint(points[i], points[0]));
      } else {
        ps.push(this.getMiddlePoint(points[i], points[i + 1]));
      }
    }
    return ps;
  }

  /**
   *
   * @param points THREE.Vector3[]
   * @param p0 THREE.Vector3
   * @returns THREE.Vector3[]
   */
  static getProjectPointsOfTriangleMesh(
    points: THREE.Vector3[],
    p0: THREE.Vector3
  ) {
    if (points.length !== 3) return [];
    const ps: THREE.Vector3[] = [];
    for (let i = 0; i < points.length; i += 3) {
      const pro1 = this.getProjectPointFrom3Point(points[i], points[i + 1], p0);
      const pro2 = this.getProjectPointFrom3Point(
        points[i + 1],
        points[i + 2],
        p0
      );
      const pro3 = this.getProjectPointFrom3Point(points[i + 2], points[i], p0);
      ps.push(pro1);
      ps.push(pro2);
      ps.push(pro3);
    }
    return ps;
  }

  static getFace(
    mesh: THREE.InstancedMesh | THREE.Mesh,
    triangleIndex: number,
    instance?: number
  ) {
    if (!mesh.geometry.index) {
      throw new Error("Geometry must be indexed!");
    }

    const allEdges = new Map<string, ISnapEdge>();

    const indices = mesh.geometry.index.array;

    // Find out the raycasted face plane

    const {plane: targetPlane} = this.getFaceData(
      triangleIndex,
      instance,
      mesh
    );

    // Get the face where the given triangle belongs

    const coplanarFacesIndices: {
      index: number;
      edges: {id: string; distance: number; points: THREE.Vector3[]}[];
    }[] = [];

    for (let faceIndex = 0; faceIndex < indices.length / 3; faceIndex++) {
      const {plane, edges} = this.getFaceData(faceIndex, instance, mesh);

      if (plane.equals(targetPlane)) {
        coplanarFacesIndices.push({index: faceIndex, edges});
        for (const {id, points, distance} of edges) {
          allEdges.set(id, {points, distance});
        }
      }
    }

    // Now, let's get all faces (groups of adjacent triangles)
    // To visualize this, draw all possible cases on paper, it's easy

    let nextFaceID = 0;
    const edgeFaceMap = new Map<string, number>();
    const faceEdgesMap = new Map<
      number,
      {edges: Set<string>; indices: Set<number>}
    >();

    for (const {index, edges} of coplanarFacesIndices) {
      const commonEdgesFaces = new Map<string, number>();

      for (const {id: edge} of edges) {
        if (edgeFaceMap.has(edge)) {
          const commonFace = edgeFaceMap.get(edge) as number;
          commonEdgesFaces.set(edge, commonFace);
        }
      }

      const edgesIDs = edges.map((edge) => edge.id);

      // Triangle is isolated, just create a new face
      if (!commonEdgesFaces.size) {
        const faceID = nextFaceID++;

        for (const {id: edge} of edges) {
          edgeFaceMap.set(edge, faceID);
        }

        faceEdgesMap.set(faceID, {
          edges: new Set(edgesIDs),
          indices: new Set([index]),
        });

        continue;
      }

      // Triangle has common edges with existing faces

      let firstFaceID: number | null = null;
      const otherFaces = new Set<number>();
      const edgesToAdd = new Set(edgesIDs);

      // First, remove all common edges
      for (const [edge, faceID] of commonEdgesFaces) {
        if (firstFaceID === null) {
          firstFaceID = faceID;
        } else if (faceID !== firstFaceID) {
          otherFaces.add(faceID);
        }

        edgeFaceMap.delete(edge);
        const {edges: foundFaceEdges} = faceEdgesMap.get(faceID)!;
        foundFaceEdges.delete(edge);
        edgesToAdd.delete(edge);
      }

      // If we hadn't found a face, we wouldn't be here
      if (firstFaceID === null) {
        throw new Error("Error computing face!");
      }

      // Now, let's merge this triangle with the first face
      const firstFace = faceEdgesMap.get(firstFaceID)!;
      const {indices: firstFaceIndices} = firstFace;
      firstFaceIndices.add(index);

      for (const edge of edgesToAdd) {
        edgeFaceMap.set(edge, firstFaceID);
        const {edges: firstFaceEdges} = firstFace;
        firstFaceEdges.add(edge);
      }

      // Finally, if there were other faces in common
      // merge them with the first one
      for (const faceID of otherFaces) {
        const otherFace = faceEdgesMap.get(faceID)!;
        const {edges: otherEdges, indices: otherIndices} = otherFace;
        const firstFace = faceEdgesMap.get(firstFaceID)!;
        const {edges: firstEdges, indices: firstIndices} = firstFace;

        for (const edge of otherEdges) {
          firstEdges.add(edge);
          edgeFaceMap.set(edge, firstFaceID);
        }

        for (const index of otherIndices) {
          firstIndices.add(index);
        }

        faceEdgesMap.delete(faceID);
      }
    }

    for (const [_faceID, {indices, edges}] of faceEdgesMap) {
      if (indices.has(triangleIndex)) {
        const foundEdges: ISnapEdge[] = [];
        for (const edgeID of edges) {
          const foundEdge = allEdges.get(edgeID)!;
          foundEdges.push(foundEdge);
        }
        return {edges: foundEdges, indices};
      }
    }

    return null;
  }
  /**
   *
   * @param point  THREE.Vector3,
   * @param lineStart  THREE.Vector3,
   * @param lineEnd  THREE.Vector3,
   * @param clamp boolean
   * @returns number
   */
  static distanceFromPointToLine(
    point: THREE.Vector3,
    lineStart: THREE.Vector3,
    lineEnd: THREE.Vector3,
    clamp = false
  ) {
    const tempLine = new THREE.Line3();
    const tempPoint = new THREE.Vector3();
    tempLine.set(lineStart, lineEnd);
    tempLine.closestPointToPoint(point, clamp, tempPoint);
    return tempPoint.distanceTo(point);
  }
  /**
   *
   * @param faceIndex number
   * @param instance number | undefined,
   * @param mesh THREE.Mesh | THREE.InstancedMesh
   * @returns {plane:THREE.Plane, edges:any};
   */
  private static getFaceData(
    faceIndex: number,
    instance: number | undefined,
    mesh: THREE.Mesh | THREE.InstancedMesh
  ) {
    const found = this.getVerticesAndNormal(mesh, faceIndex, instance);
    const {p1, p2, p3, faceNormal} = found;

    // Round numbers to make sure numerical precision
    // doesn't affect edge detection

    this.round(p1);
    this.round(p2);
    this.round(p3);
    this.round(faceNormal);

    // To make sure the edge AB === the edge BA

    const vertices = [
      {id: `${p1.x}|${p1.y}|${p1.z}`, value: p1},
      {id: `${p2.x}|${p2.y}|${p2.z}`, value: p2},
      {id: `${p3.x}|${p3.y}|${p3.z}`, value: p3},
    ];

    vertices.sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      }
      if (a.id > b.id) {
        return 1;
      }
      return 0;
    });

    const [{id: id1, value: v1}, {id: id2, value: v2}, {id: id3, value: v3}] =
      vertices;

    // Create IDs to identify the edges

    const edges = [
      {
        id: `${id1}|${id2}`,
        distance: v1.distanceTo(v2),
        points: [v1, v2],
      },
      {
        id: `${id2}|${id3}`,
        distance: v2.distanceTo(v3),
        points: [v2, v3],
      },
      {
        id: `${id1}|${id3}`,
        distance: v1.distanceTo(v3),
        points: [v1, v3],
      },
    ];

    const plane = new THREE.Plane();
    plane.setFromNormalAndCoplanarPoint(faceNormal, p1);
    return {plane, edges};
  }

  /**
   *
   * @param mesh THREE.Mesh | THREE.InstancedMesh
   * @param faceIndex number
   * @param instance number | undefined
   * @returns {p1:THREE.Vector3, p2:THREE.Vector3, p3:THREE.Vector3, faceNormal:THREE.Vector3};
   */
  static getVerticesAndNormal(
    mesh: THREE.Mesh | THREE.InstancedMesh,
    faceIndex: number,
    instance: number | undefined
  ) {
    if (!mesh.geometry.index) {
      throw new Error("Geometry must be indexed!");
    }

    const indices = mesh.geometry.index.array;

    const pos = mesh.geometry.attributes.position.array;
    const nor = mesh.geometry.attributes.normal.array;

    const i1 = indices[faceIndex * 3] * 3;
    const i2 = indices[faceIndex * 3 + 1] * 3;
    const i3 = indices[faceIndex * 3 + 2] * 3;

    const p1 = new THREE.Vector3(pos[i1], pos[i1 + 1], pos[i1 + 2]);
    const p2 = new THREE.Vector3(pos[i2], pos[i2 + 1], pos[i2 + 2]);
    const p3 = new THREE.Vector3(pos[i3], pos[i3 + 1], pos[i3 + 2]);

    const n1 = new THREE.Vector3(nor[i1], nor[i1 + 1], nor[i1 + 2]);
    const n2 = new THREE.Vector3(nor[i2], nor[i2 + 1], nor[i2 + 2]);
    const n3 = new THREE.Vector3(nor[i3], nor[i3 + 1], nor[i3 + 2]);

    const averageNx = (n1.x + n2.x + n3.x) / 3;
    const averageNy = (n1.y + n2.y + n3.y) / 3;
    const averageNz = (n1.z + n2.z + n3.z) / 3;
    const faceNormal = new THREE.Vector3(averageNx, averageNy, averageNz);

    if (!faceNormal.x && !faceNormal.y && !faceNormal.z) {
      console.log("hey");
    }

    // Apply instance transformation to vertex and normal

    if (instance !== undefined && mesh instanceof THREE.InstancedMesh) {
      const transform = new THREE.Matrix4();
      mesh.getMatrixAt(instance, transform);
      const rotation = new THREE.Matrix4();
      rotation.extractRotation(transform);
      faceNormal.applyMatrix4(rotation);
      p1.applyMatrix4(transform);
      p2.applyMatrix4(transform);
      p3.applyMatrix4(transform);
    }

    return {p1, p2, p3, faceNormal};
  }
  private static round(vector: THREE.Vector3) {
    const factor = 1000;
    vector.x = Math.trunc(vector.x * factor) / factor;
    vector.y = Math.trunc(vector.y * factor) / factor;
    vector.z = Math.trunc(vector.z * factor) / factor;
  }
}
