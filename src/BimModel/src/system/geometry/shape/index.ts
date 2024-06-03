/**
 * @module GeometrySystem
 */
import * as THREE from "three";
import {IShapeType} from "../types";
export class ShapeGeometry extends THREE.Shape {
  points: THREE.Vector3[] = [];
  /**
   *
   */
  constructor(private workPlane: THREE.Plane, private shapeType: IShapeType) {
    super();
  }
  static fromRectangular(workPlane: THREE.Plane) {
    const shape = new ShapeGeometry(workPlane, "Rectangular");
    return shape;
  }
}
