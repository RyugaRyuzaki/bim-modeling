import * as THREE from "three";
import {Components} from "@BimModel/src/Components";
import {BaseDraw} from "./BaseDraw";
import {IDrawType} from "@ModelingComponent/types";
import {LocationArc, LocationLine, LocationPoint} from "@BimModel/src/system";

export class DrawPoint extends BaseDraw {
  drawType: IDrawType = "Point";

  /**
   *
   */
  constructor(components: Components, workPlane: THREE.Plane) {
    super(components, workPlane);
  }
  onClick = (_e: MouseEvent) => {
    if (!this.foundPoint || this.mousedown) return;
    this.addElement();
  };
  onMouseMove = (_e: MouseEvent) => {
    this.findPoint = _e;
    if (!this.foundPoint || this.mousedown) return;
    this.RaycasterComponent!.updateInfo(this.foundPoint);
  };
  onMousedown = (_e: MouseEvent) => {
    if (_e.button === 0) this.mousedown = true;
  };
  onKeyDown = (_e: KeyboardEvent) => {};

  onFinished = () => {
    this.drawingDimension.visible = false;
    this.addElement();
  };
  onCallBack = (_value?: number) => {};
  dispose = () => {
    this.drawingDimension.visible = false;
  };
  addElement = () => {};
  createElement = () => {};
  updateElement = (_location: LocationPoint | LocationArc | LocationLine) => {};
}
