import * as THREE from "three";

export * from "./Extrusion";
export * from "./Brep";
export * from "./Profiles";
export * from "./HalfSpace";
export * from "./Geometry";
export * from "./Revolved";
export interface ILocationLine {
  start: THREE.Vector3;
  end: THREE.Vector3;
}
export interface ILocationArc {
  start?: THREE.Vector3;
  end?: THREE.Vector3;
  angle?: number;
  center: THREE.Vector3;
  radius: number;
  numberSegment: number;
}
export interface ILocationPoint {
  point: THREE.Vector3;
}
export type ILocation = ILocationLine | ILocationArc | ILocationPoint;
