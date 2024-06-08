/**
 * @module DrawArc
 */
import * as THREE from "three";
import {Components} from "@BimModel/src/Components";
import {BaseDraw} from "./BaseDraw";
import {LocationArc, LocationLine, LocationPoint} from "@system/geometry";
import {getDirection} from "@BimModel/src/utils";
import {IDrawType} from "@ModelingComponent/types";

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
    // toggle visibility to true
    if (!this.locationArc)
      this.locationArc = new LocationArc(this.components, this.workPlane);
    if (this.count === 1) {
      this.locationArc.update2PointsArc(this.start, this.movingPoint);
      this.drawingDimension.updateLine(
        this.start,
        this.movingPoint,
        this.workPlane
      );
    } else if (this.count === 2) {
      this.locationArc.update3PointsArc(this.start, this.end, this.movingPoint);
      if (this.locationArc.location) {
        const {center, radius} = this.locationArc.location;
        const dir = getDirection(center, this.movingPoint);
        const newMoving = center.clone().add(dir.multiplyScalar(radius));
        this.drawingDimension.updateRadius(center, newMoving);
      }
    }
    this.locationArc.visible = true;
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
    this.drawingDimension.visible = false;
    if (this.locationArc) this.locationArc.visible = false;
    this.inputKey = "";
    this.count = 0;
  };
  onCallBack = (_value?: number) => {};
  dispose = () => {
    this.drawingDimension.visible = false;
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
