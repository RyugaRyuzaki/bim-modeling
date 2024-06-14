/**
 * @module DrawArc
 */
import * as THREE from "three";
import {Components} from "@BimModel/src/Components";
import {BaseDraw} from "./BaseDraw";
import {LocationArc, LocationLine, LocationPoint} from "@system/geometry";
import {IDrawType} from "@ModelingComponent/types";
import {isOrthoSignal, lengthUnitSignal} from "@BimModel/src/Signals";

export class DrawArc extends BaseDraw {
  drawType: IDrawType = "Arc";
  private locationArc!: LocationArc;
  private count = 0;
  private movingPoint: THREE.Vector3 = new THREE.Vector3();
  private start: THREE.Vector3 = new THREE.Vector3();
  private end: THREE.Vector3 = new THREE.Vector3();
  /**
   *
   */
  constructor(components: Components, workPlane: THREE.Plane) {
    super(components, workPlane);
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
    // toggle visibility to true
    if (!this.locationArc)
      this.locationArc = new LocationArc(this.components, this.workPlane);
    if (this.count === 1) {
      this.locationArc.update2PointsArc(this.start, this.movingPoint);
    } else if (this.count === 2) {
      this.locationArc.update3PointsArc(this.start, this.end, this.movingPoint);
      this.locationArc.visibleAngle = true;
    }
    this.locationArc.visible = true;
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
      if (!this.locationArc) return;
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
        this.locationArc.update2PointsArc(this.start, this.end);
        this.count = 2;
      }
    }
    if ((_e.key >= "0" && _e.key <= "9") || _e.key === ".") {
      this.inputKey += _e.key;
    }
  };
  onFinished = () => {
    if (this.locationArc) {
      this.locationArc.visible = false;
      this.locationArc.visibleAngle = false;
    }

    this.inputKey = "";
    this.count = 0;
  };
  onCallBack = (_value?: number) => {};
  dispose = () => {
    this.locationArc?.dispose();
    (this.locationArc as any) = null;
    this.count = 0;
  };
  addElement = () => {};
  createElement = () => {};
  updateElement = (_location: LocationPoint | LocationArc | LocationLine) => {};
  onVisibility = (visible: boolean) => {
    if (!this.tempElement) return;
    if (visible) {
      this.components.modelScene.add(...this.tempElement.meshes);
    } else {
      for (const mesh of this.tempElement.meshes) {
        mesh.removeFromParent();
      }
    }
  };
}
