import * as THREE from "three";

export interface ISnapTriangle {
  trianglePoints: THREE.Vector3[];
  currentPoint: THREE.Vector3;
}

export interface ISnapper {
  point: THREE.Vector3;
  css: string;
}
