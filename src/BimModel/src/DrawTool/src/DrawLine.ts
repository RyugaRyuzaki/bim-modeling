/**
 * @module DrawLine
 */
import * as THREE from "three";
import {Components, isOrthoSignal} from "@BimModel/src";
import {BaseDraw} from "./BaseDraw";
import {LocationLine} from "@system/geometry";
export class DrawLine extends BaseDraw {
  private tempLocation!: LocationLine;
  private count = 0;
  private points: THREE.Vector3[] = [];
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
    if (this.count > 0 && isOrthoSignal.value) {
      this.start = this.end.clone();
    } else {
      this.start = this.foundPoint.clone();
    }
    this.points.push(this.start);
    // if the first time user click
    // if another time
    if (this.count >= 1) {
      // if measureControl.tempDim is not null then release memory
      if (this.tempLocation) {
        this.tempLocation.visible = false;
        (this.tempLocation as any) = null;
      }
    }
    // increase the count
    this.count++;
    if (this.count === 2) this.count = 1;
  };
  onMouseMove = (_e: MouseEvent) => {
    this.findPoint = _e;
    if (!this.foundPoint || this.mousedown) return;
    this.RaycasterComponent!.updateInfo(this.foundPoint);
    if (this.count === 0) return;
    if (isOrthoSignal.value) {
      this.end = this.getOrtho(
        this.start,
        this.foundPoint.clone()
      ) as THREE.Vector3;
    } else {
      this.end = this.foundPoint.clone();
      this.orthoDir = null;
    }
    // if measureControl.tempDim is  null then create a dimensionLine
    if (!this.tempLocation)
      this.tempLocation = new LocationLine(this.components);
    // toggle visibility to true
    this.tempLocation.update(this.points[this.points.length - 1], this.end);
    this.tempLocation.visible = true;
    this.drawingDimension.updateLine(
      this.points[this.points.length - 1],
      this.end,
      this.workPlane
    );
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
      if (this.tempLocation) {
        const start = this.points[this.points.length - 1];
        const end = this.getDistance(start, this.end, distance);
        this.tempLocation.update(start, end);
        this.onFinished();
        this.start = end.clone();
        this.points.push(this.start);
        this.inputKey = "";
        this.count = 1;
      }
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
    this.points = [];
  };
  onCallBack = (_value?: number) => {};
  dispose = () => {
    this.drawingDimension.visible = false;
    this.tempLocation?.dispose();
    (this.tempLocation as any) = null;
    this.count = 0;
    this.points = [];
  };
}
