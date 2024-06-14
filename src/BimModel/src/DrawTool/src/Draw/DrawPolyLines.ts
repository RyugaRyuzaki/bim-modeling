import * as THREE from "three";

import {Components} from "@BimModel/src";
import {BaseDraw} from "./BaseDraw";
import {IDrawType} from "@ModelingComponent/types";
import {LocationArc, LocationLine, LocationPoint} from "@BimModel/src/system";
export class DrawPolyLines extends BaseDraw {
  drawType: IDrawType = "PolyLines";
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