import * as THREE from "three";
export const dimStyle = {
  arrow: 0.1,
  offset: 0.02,
  extend: 0.3,
};
export const GeometryCSS = {
  snap: {
    endpoint: "snap-endpoint",
    endLine: "endLine",
    intersect: "snap-intersect",
    middle: "snap-middle",
  },
  tag: "tag",
  tagInfo: "tag info",
};
export interface ILocationLine {
  start: THREE.Vector3;
  end: THREE.Vector3;
}
export interface ILocationArc {
  start?: THREE.Vector3;
  end?: THREE.Vector3;
  center: THREE.Vector3;
  radius: number;
  numberSegment: number;
}
export interface ILocationPoint {
  point: THREE.Vector3;
}
export interface IBaseLocation<T> {
  location: T;
  onChange: (value: T) => void;
}

export type IShapeType = "Rectangular" | "I-Section" | "Circle" | "Polygon";
