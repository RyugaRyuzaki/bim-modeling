import * as THREE from "three";
import {Components} from "@BimModel/src/Components";
import {BaseDraw} from "./BaseDraw";
import {LocationArc, LocationLine, LocationPoint} from "@BimModel/src/system";

export class DrawPickLine extends BaseDraw {
  /**
   *
   */
  constructor(components: Components, workPlane: THREE.Plane) {
    super(components, workPlane);
  }
  onClick = (_e: MouseEvent) => {};
  onMouseMove = (_e: MouseEvent) => {};
  onMousedown = (_e: MouseEvent) => {};
  onKeyDown = (_e: KeyboardEvent) => {};
  onFinished = () => {};
  onCallBack = (_value?: number) => {};
  dispose = () => {};
  addElement = () => {};
  createElement = () => {};
  updateElement = (_location: LocationPoint | LocationArc | LocationLine) => {};
}
