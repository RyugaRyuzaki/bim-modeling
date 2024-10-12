/**
 * @module DrawArc
 */
import * as THREE from "three";
import {BaseDraw} from "./BaseDraw";
import {LocationArc} from "@system/geometry";
import {isOrthoSignal, lengthUnitSignal} from "@BimModel/src/Signals";
import {IElement} from "clay";
import {BaseDrawCategory} from "./BaseDrawCategory";

export abstract class DrawArc extends BaseDraw<LocationArc, IElement> {
  abstract tempElement: IElement;

  abstract disposeElement: () => void;

  abstract addElement: () => void;

  abstract createElement: () => void;

  abstract updateElement: () => void;

  public location!: LocationArc;

  private count = 0;

  private movingPoint: THREE.Vector3 = new THREE.Vector3();

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
    if (this.count === 0) {
      this.start = this.foundPoint.clone();
      if (this.Snapper.snap) this.start.copy(this.Snapper.snap);
    } else if (this.count === 1) {
      this.end = this.foundPoint.clone();
      if (this.Snapper.snap) this.end.copy(this.Snapper.snap);
    }
    this.count++;
    if (this.count === 3) {
      this.count = 0;
      this.onFinished();
    }
  };
  onMouseMove = (_e: MouseEvent) => {
    this.findPoint = _e;
    this.Snapper.find = _e;
    this.Snapper.snapGrid = this.foundPoint;
    if (!this.foundPoint || this.mousedown) return;
    this.RaycasterComponent!.updateInfo(this.foundPoint);
    if (this.count === 0) return;
    this.movingPoint = this.foundPoint.clone();
    if (this.count === 1) {
      if (isOrthoSignal.value) {
        this.movingPoint = this.getOrtho(
          this.start,
          this.foundPoint.clone()
        ) as THREE.Vector3;
      } else {
        this.movingPoint = this.foundPoint.clone();
        this.orthoDir = null;
      }
    }
    if (this.Snapper.snap) this.movingPoint = this.Snapper.snap.clone();
    // toggle visibility to true
    if (!this.location)
      this.location = new LocationArc(this.components, this.workPlane);
    if (this.count === 1) {
      this.location.update2PointsArc(this.start, this.movingPoint);
    } else if (this.count === 2) {
      this.location.update3PointsArc(this.start, this.end, this.movingPoint);
      this.location.visibleAngle = true;
    }
    this.location.visible = true;
  };
  onMousedown = (_e: MouseEvent) => {
    if (_e.button === 0) this.mousedown = true;
    if (_e.button != 2) return;
    this.onFinished();
  };
  onKeyDown = (_e: KeyboardEvent) => {
    if (_e.key === "Enter") {
      if (this.count === 0) {
        this.inputKey = "";
        return;
      }
      if (!this.location) return;
      const distance = this.getInputKey();
      if (!distance) {
        this.inputKey = "";
        return;
      }
      const {factor} = lengthUnitSignal.value;
      if (this.count === 1) {
        this.end = this.getDistance(
          this.start.clone(),
          this.movingPoint,
          distance / factor
        );
        this.location.update2PointsArc(this.start, this.end);
        this.count = 2;
      }
    }
    if ((_e.key >= "0" && _e.key <= "9") || _e.key === ".") {
      this.inputKey += _e.key;
    }
  };
  onFinished = () => {
    if (this.location) {
      this.location.visible = false;
      this.location.visibleAngle = false;
    }

    this.inputKey = "";
    this.count = 0;
  };
  onCallBack = (_value?: number) => {};
  dispose = () => {
    this.location?.dispose();
    (this.location as any) = null;
    this.count = 0;
  };
}
