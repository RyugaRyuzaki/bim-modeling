/**
 * @module DrawCircle
 */
import * as THREE from "three";
import {Components} from "@BimModel/src/Components";
import {BaseDraw} from "./BaseDraw";
import {LocationArc} from "@system/geometry";
import {getDirection} from "@BimModel/src/utils";

export class DrawCircle extends BaseDraw {
  private tempLeftLocation!: LocationArc;
  private tempRightLocation!: LocationArc;
  private count = 0;
  private start: THREE.Vector3 = new THREE.Vector3();
  private end: THREE.Vector3 = new THREE.Vector3();
  /**
   *
   */
  constructor(components: Components) {
    super(components);
  }
  private getMirror() {
    const dir = getDirection(this.start, this.end);
    const dis = this.start.distanceTo(this.end);
    return this.start.clone().add(dir.multiplyScalar(-dis));
  }

  onClick = (_e: MouseEvent) => {
    if (!this.foundPoint || this.mousedown) return;
    this.inputKey = "";
    this.start = this.foundPoint.clone();
    this.count++;
    if (this.count === 2) {
      this.count = 0;
      this.onFinished();
    }
  };
  onMouseMove = (_e: MouseEvent) => {
    this.findPoint = _e;
    if (!this.foundPoint || this.mousedown) return;
    this.RaycasterComponent!.updateInfo(this.foundPoint);
    if (this.count === 0) return;
    this.end = this.foundPoint.clone();
    // update tempLeftLocation
    if (!this.tempLeftLocation)
      this.tempLeftLocation = new LocationArc(this.components, this.workPlane);
    this.tempLeftLocation.updateCircle(this.start, this.end);
    this.tempLeftLocation.visible = true;
    //update tempRightLocation
    if (!this.tempRightLocation)
      this.tempRightLocation = new LocationArc(this.components, this.workPlane);
    this.tempRightLocation.updateCircle(this.start, this.getMirror());
    this.tempRightLocation.visible = true;
    //update drawingDimension
    this.drawingDimension.updateRadius(this.start, this.end, this.workPlane);
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
      if (this.tempLeftLocation && this.tempRightLocation) {
        this.end = this.getDistance(this.start, this.end, distance);
        this.tempLeftLocation.updateCircle(this.start, this.end);
        this.tempRightLocation.updateCircle(this.start, this.getMirror());
        this.onFinished();
        this.inputKey = "";
        this.count = 0;
      }
    }
    if (_e.key >= "0" && _e.key <= "9") {
      this.inputKey += _e.key;
    }
  };
  onFinished = () => {
    this.drawingDimension.visible = false;
    if (this.tempLeftLocation) {
      this.tempLeftLocation.visible = false;
      (this.tempLeftLocation as any) = null;
    }
    if (this.tempRightLocation) {
      this.tempRightLocation.visible = false;
      (this.tempRightLocation as any) = null;
    }
    this.inputKey = "";
    this.count = 0;
  };
  onCallBack = (_value?: number) => {};
  dispose = () => {
    this.drawingDimension.visible = false;
    this.tempLeftLocation?.dispose();
    (this.tempLeftLocation as any) = null;
    this.tempRightLocation?.dispose();
    (this.tempRightLocation as any) = null;
    this.count = 0;
  };
}
