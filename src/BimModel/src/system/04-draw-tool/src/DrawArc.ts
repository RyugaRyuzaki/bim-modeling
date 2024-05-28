/**
 * @module DrawArc
 */
import * as THREE from "three";
import {Components} from "@BimModel/src/Components";
import {BaseDraw} from "./BaseDraw";
import {LocationArc} from "@system/01-geometry";

export class DrawArc extends BaseDraw {
  private tempLocation!: LocationArc;
  private count = 0;
  private movingPoint: THREE.Vector3 = new THREE.Vector3();
  private start: THREE.Vector3 = new THREE.Vector3();
  private end: THREE.Vector3 = new THREE.Vector3();
  /**
   *
   */
  constructor(components: Components) {
    super(components);
  }
  onClick = (_e: MouseEvent) => {
    if (!this.foundPoint || this.mousedown) return;
    this.inputKey = "";
    if (this.count === 0) {
      this.start = this.foundPoint.clone();
    } else if (this.count === 1) {
      this.end = this.foundPoint.clone();
    }
    this.count++;
    if (this.count === 3) {
      this.count = 0;
      this.onFinished();
    }
  };
  onMouseMove = (_e: MouseEvent) => {
    this.findPoint = _e;
    if (!this.foundPoint || this.mousedown) return;
    this.RaycasterComponent!.updateInfo(this.foundPoint);
    if (this.count === 0) return;
    this.movingPoint = this.foundPoint.clone();
    // if measureControl.tempDim is  null then create a dimensionLine
    if (!this.tempLocation)
      this.tempLocation = new LocationArc(this.components, this.workPlane);
    // toggle visibility to true
    if (this.count === 1) {
      this.tempLocation.update2PointsArc(this.start, this.movingPoint);
      this.drawingDimension.updateLine(
        this.start,
        this.movingPoint,
        this.workPlane
      );
    } else if (this.count === 2) {
      this.tempLocation.update3PointsArc(
        this.start,
        this.end,
        this.movingPoint
      );
      this.drawingDimension.updateRadius(
        this.start,
        this.movingPoint,
        this.workPlane
      );
    }
    this.tempLocation.visible = true;
    this.drawingDimension.visible = true;
  };
  onMousedown = (_e: MouseEvent) => {
    if (_e.button === 0) this.mousedown = true;
    if (_e.button != 2) return;
    this.onFinished();
  };
  onKeyDown = (_e: KeyboardEvent) => {
    if (_e.key === "Enter") {
      if (this.count === 0 || this.count % 2 === 0) {
        this.inputKey = "";
        return;
      }
      const distance = this.getInputKey();
      if (!distance) {
        this.inputKey = "";
        return;
      }
      // if (this.tempLocation) {

      // }
    }
    if (_e.key >= "0" && _e.key <= "9") {
      this.inputKey += _e.key;
    }
  };
  onFinished = () => {
    if (this.tempLocation) {
      this.tempLocation.visible = false;
      this.drawingDimension.visible = false;
      (this.tempLocation as any) = null;
    }
    this.inputKey = "";
    this.count = 0;
  };
  onCallBack = (_value?: number) => {};
  dispose = () => {
    this.drawingDimension.visible = false;
    this.tempLocation?.dispose();
    (this.tempLocation as any) = null;
    this.count = 0;
  };
}
