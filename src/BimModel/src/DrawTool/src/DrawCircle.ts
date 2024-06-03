/**
 * @module DrawCircle
 */
import * as THREE from "three";
import {Components} from "@BimModel/src/Components";
import {BaseDraw} from "./BaseDraw";
import {LocationArc} from "@system/geometry";
import {getDirection} from "@BimModel/src";
import {IDrawType} from "@ModelingComponent/types";

export class DrawCircle extends BaseDraw {
  drawType: IDrawType = "Circle";
  private leftLocationArc!: LocationArc;
  private rightLocationArc!: LocationArc;
  private count = 0;
  private start: THREE.Vector3 = new THREE.Vector3();
  private end: THREE.Vector3 = new THREE.Vector3();
  // this.leftLocationArc = new LocationArc(this.components, this.workPlane);
  /**
   *
   */
  constructor(components: Components, workPlane: THREE.Plane) {
    super(components, workPlane);
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
    if (!this.leftLocationArc)
      this.leftLocationArc = new LocationArc(this.components, this.workPlane);
    this.leftLocationArc.updateCircle(this.start, this.end);
    this.leftLocationArc.visible = true;
    if (!this.rightLocationArc)
      this.rightLocationArc = new LocationArc(this.components, this.workPlane);
    //update tempRightLocation
    this.rightLocationArc.updateCircle(this.start, this.getMirror());
    this.rightLocationArc.visible = true;
    //update drawingDimension
    this.drawingDimension.updateRadius(this.start, this.end);
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
      this.end = this.getDistance(this.start, this.end, distance);
      if (this.leftLocationArc)
        this.leftLocationArc.updateCircle(this.start, this.end);
      if (this.rightLocationArc)
        this.rightLocationArc.updateCircle(this.start, this.getMirror());
      this.onFinished();
      this.inputKey = "";
      this.count = 0;
    }
    if (_e.key >= "0" && _e.key <= "9") {
      this.inputKey += _e.key;
    }
  };
  onFinished = () => {
    if (this.leftLocationArc) this.leftLocationArc.visible = false;
    if (this.rightLocationArc) this.rightLocationArc.visible = false;
    this.drawingDimension.visible = false;

    this.inputKey = "";
    this.count = 0;
  };
  onCallBack = (_value?: number) => {};
  dispose = () => {
    this.leftLocationArc?.dispose();
    (this.leftLocationArc as any) = null;
    this.rightLocationArc?.dispose();
    (this.rightLocationArc as any) = null;
    this.drawingDimension.visible = false;
    this.count = 0;
  };
}
