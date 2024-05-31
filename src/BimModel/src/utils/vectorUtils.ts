import {Box3, BufferGeometry, InstancedMesh, Mesh, Plane, Sphere} from "three";

import {Vector3} from "three";

export const defaultToleranceDistance = 0.01;
/**
 * compare 2 value number using for tolorence
 * @param {*} firstValue
 * @param {*} secondValue
 * @param {*} tolerance
 * @returns
 */
export function areEqual(
  firstValue: number,
  secondValue: number,
  tolerance = defaultToleranceDistance
) {
  return (
    secondValue - tolerance < firstValue && firstValue < secondValue + tolerance
  );
}
/**
 *
 * @param {*} v1
 * @param {*} v2
 * @returns
 */
export function getDirection(start: Vector3, end: Vector3) {
  return new Vector3(
    end.x - start.x,
    end.y - start.y,
    end.z - start.z
  ).normalize();
}
/**
 *
 * @param {*} v1
 * @param {*} v2
 * @returns
 */
export function areEqualVector(
  v1: Vector3,
  v2: Vector3,
  tolerance = defaultToleranceDistance
) {
  return (
    areEqual(v1.x, v2.x, tolerance) &&
    areEqual(v1.y, v2.y, tolerance) &&
    areEqual(v1.z, v2.z, tolerance)
  );
}

/**
 *
 * @param {Vector3} p1
 * @param {Vector3} p2
 * @param {Vector3} p3
 * @returns a projection point(v3) on a line(Vector) create from 2 points (v1,v2)
 */
export function getProjectPointFrom3Point(
  p1: Vector3,
  p2: Vector3,
  p3: Vector3
) {
  const v1 = new Vector3(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z).normalize();
  const v2 = new Vector3(p3.x - p1.x, p3.y - p1.y, p3.z - p1.z).normalize();
  return p1
    .clone()
    .add(
      v1.clone().multiplyScalar(p1.distanceTo(p3) * Math.cos(v1.angleTo(v2)))
    );
}

/**
 *
 * @param {*} subset
 * @returns
 */
export function getSectionBox(subset: Mesh) {
  const points: Vector3[] = [];
  const posArray = subset.geometry.attributes.position;
  const index = subset.geometry.index?.array;
  if (!index) return null;
  for (let i = 0; i < index.length; i++) {
    const x = posArray.getX(index[i]);
    const y = posArray.getY(index[i]);
    const z = posArray.getZ(index[i]);
    points.push(new Vector3(x, y, z));
  }
  const geo: BufferGeometry = new BufferGeometry().setFromPoints(points);
  geo.computeBoundingBox();
  geo.computeBoundingSphere();

  const {max, min} = geo.boundingBox as Box3;
  const {center, radius} = geo.boundingSphere as Sphere;
  geo.dispose();
  return {
    center: center,
    max: max,
    min: min,
    radius: radius,
  };
}

/**
 *
 * @param {*} subset
 * @returns
 */
export function getAllPointsSubset(subset: Mesh) {
  const points: Vector3[] = [];
  const posArray = subset.geometry.attributes.position;
  const index = subset.geometry.index?.array;
  if (!index) return null;
  for (let i = 0; i < index.length; i++) {
    const x = posArray.getX(index[i]);
    const y = posArray.getY(index[i]);
    const z = posArray.getZ(index[i]);
    points.push(new Vector3(x, y, z));
  }
  return points.filter(
    (value, index, self) =>
      self.findIndex((snap) => snap.distanceTo(value) < 1e-6) === index
  );
}
/**
 * find a face equal to the plane intersection
 * @param {*} subset
 * @param {*} plane
 * @returns
 */
export function findFaceFromSubset(geometry: BufferGeometry, plane: Plane) {
  const arrIndex = geometry.index?.array;
  if (!arrIndex) return [];
  const equalPoints: Vector3[] = [];
  const pos0 = geometry.attributes.position;
  const normal0 = geometry.attributes.normal;
  for (let i = 0; i < arrIndex.length; i++) {
    const normal = new Vector3(
      normal0.getX(arrIndex[i]),
      normal0.getY(arrIndex[i]),
      normal0.getZ(arrIndex[i])
    );
    const v0 = new Vector3(
      pos0.getX(arrIndex[i]),
      pos0.getY(arrIndex[i]),
      pos0.getZ(arrIndex[i])
    );
    const dis = plane.distanceToPoint(v0);
    if (
      (areEqual(normal.angleTo(plane.normal), 0.0, 1e-3) ||
        areEqual(normal.angleTo(plane.normal), Math.PI, 1e-3)) &&
      areEqual(dis, 0.0, 1.0e-3)
    ) {
      equalPoints.push(v0);
    }
  }
  return equalPoints;
}
/**
 * using horonce function calculate all triangle
 * @param {*} geometry
 * @returns
 */
export function getAreaSurfaceFromPoints(geometry: BufferGeometry) {
  let sum = 0;
  const coords: Vector3[] = [];
  const arrPos = geometry.attributes.position;
  const count = geometry.attributes.position.count;
  if (count % 3 !== 0) return 0;
  for (let i = 0; i < count; i++) {
    coords.push(new Vector3(arrPos.getX(i), arrPos.getY(i), arrPos.getZ(i)));
  }
  for (let i = 0; i < coords.length / 3; i++) {
    const a = coords[i * 3].distanceTo(coords[i * 3 + 1]);
    const b = coords[i * 3 + 1].distanceTo(coords[i * 3 + 2]);
    const c = coords[i * 3 + 2].distanceTo(coords[i * 3]);
    sum += Math.sqrt((a + b + c) * (a + b - c) * (b + c - a) * (c + a - b)) / 4;
  }
  return sum;
}
/**
 * using horonce function calculate all triangle
 * @param {Array[Vector3]} points
 * @returns
 */
export function getAreaSurfaceFromListPoints(points: Vector3[]) {
  let sum = 0;
  if (points.length % 3 !== 0) return 0;

  for (let i = 0; i < points.length / 3; i++) {
    const a = points[i * 3].distanceTo(points[i * 3 + 1]);
    const b = points[i * 3 + 1].distanceTo(points[i * 3 + 2]);
    const c = points[i * 3 + 2].distanceTo(points[i * 3]);
    sum += Math.sqrt((a + b + c) * (a + b - c) * (b + c - a) * (c + a - b)) / 4;
  }
  return sum;
}

/**
 * transform axises to a specific normal vector
 * @param {*} normal
 * @returns
 */
export function getLocalVectorOnFace(normal: Vector3) {
  if (
    areEqual(normal.angleTo(new Vector3(0, 1, 0)), 0) ||
    areEqual(normal.angleTo(new Vector3(0, 1, 0)), Math.PI)
  ) {
    return {
      x: new Vector3(1, 0, 0),
      z: new Vector3(0, 0, 1),
    };
  } else {
    const z = new Vector3(0, 0, 0)
      .crossVectors(normal, new Vector3(0, 1, 0))
      .normalize();
    const x = new Vector3(0, 0, 0).crossVectors(normal, z).normalize();
    return {
      x: x,
      z: z,
    };
  }
}
/**
 *
 * @param {object} mesh
 * @returns number is volume of this mesh
 */
export function calculateVolume(mesh: Mesh | InstancedMesh) {
  // get all vertices of the mesh
  const vertices = mesh.geometry.attributes.position.array;

  // get all faces of the mesh
  const faces = mesh.geometry.index?.array;
  if (!faces) return 0;
  let volume = 0;

  for (let i = 0; i < faces.length; i += 3) {
    // get 3 vertices of the face
    const v1 = new Vector3(
      vertices[faces[i] * 3],
      vertices[faces[i] * 3 + 1],
      vertices[faces[i] * 3 + 2]
    );
    const v2 = new Vector3(
      vertices[faces[i + 1] * 3],
      vertices[faces[i + 1] * 3 + 1],
      vertices[faces[i + 1] * 3 + 2]
    );
    const v3 = new Vector3(
      vertices[faces[i + 2] * 3],
      vertices[faces[i + 2] * 3 + 1],
      vertices[faces[i + 2] * 3 + 2]
    );

    // calculate normal of face
    const normal = new Vector3().crossVectors(
      v2.clone().sub(v1),
      v3.clone().sub(v1)
    );

    // calculate volume tetrahedron = 1/6 * (V1 dot N) * (V2 dot V3)
    volume += (v1.dot(normal) * v2.dot(v3)) / 6;
  }

  return Math.abs(volume);
}
