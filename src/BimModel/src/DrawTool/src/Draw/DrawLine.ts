/**
 * @module DrawLine
 */
import * as THREE from "three";

import {isOrthoSignal, lengthUnitSignal} from "@BimModel/src";
import {BaseDraw} from "./BaseDraw";
import {LocationLine} from "@system/geometry";
import {IElement} from "clay";
import {BaseDrawCategory} from "./BaseDrawCategory";
export abstract class DrawLine extends BaseDraw<LocationLine, IElement> {
  abstract tempElement: IElement;

  abstract disposeElement: () => void;

  abstract addElement: () => void;

  abstract createElement: () => void;

  abstract updateElement: () => void;

  public location!: LocationLine;

  private count = 0;

  private points: THREE.Vector3[] = [];

  private start: THREE.Vector3 = new THREE.Vector3();

  private end: THREE.Vector3 = new THREE.Vector3();

  /**
   *
   */
  constructor(public category: BaseDrawCategory) {
    const {components, workPlane} = category;
    super(components, workPlane);
  }
  onClick = (_e: MouseEvent) => {
    if (!this.foundPoint || this.mousedown) return;
    this.inputKey = "";
    if (this.count > 0 && isOrthoSignal.value) {
      this.start = this.end.clone();
    } else {
      this.start = this.foundPoint.clone();
    }
    if (this.Snapper.snap) this.start.copy(this.Snapper.snap);
    this.points.push(this.start);
    // if the first time user click
    // if another time
    if (this.count >= 1) {
      if (this.location) this.location.visible = false;
      this.addElement();
    }
    // increase the count
    this.count++;
    if (this.count === 2) {
      this.count = 1;
    }
  };
  onMouseMove = (_e: MouseEvent) => {
    this.findPoint = _e;
    this.Snapper.find = _e;
    // this.Snapper.snapGrid = this.foundPoint;
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
    if (this.Snapper.snap) this.end = this.Snapper.snap.clone();
    const start = this.points[this.points.length - 1];
    if (!this.location)
      this.location = new LocationLine(this.components, this.workPlane.clone());
    this.location.update(start, this.end);
    this.location.visible = true;
    this.createElement();
    this.updateElement();
  };
  onMousedown = (_e: MouseEvent) => {
    if (_e.button === 0) this.mousedown = true;
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
      const {factor} = lengthUnitSignal.value;
      const start = this.points[this.points.length - 1];
      const end = this.getDistance(start, this.end, distance / factor);
      if (this.location) {
        this.location.update(start, end);
        this.updateElement();
        this.location.visible = false;
      }
      this.onFinished();
      this.start = end.clone();
      this.points.push(this.start);
      this.inputKey = "";
      this.count = 1;
    }
    if (_e.key >= "0" && _e.key <= "9") {
      this.inputKey += _e.key;
    }
  };
  onFinished = () => {
    this.addElement();
    this.inputKey = "";
    this.count = 0;
    this.points = [];
  };
  onCallBack = (_value?: number) => {};
  dispose = () => {
    this.disposeElement!();
    this.location?.dispose();
    (this.location as any) = null;
    this.count = 0;
    this.points = [];
  };
}
