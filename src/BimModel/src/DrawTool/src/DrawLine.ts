/**
 * @module DrawLine
 */
import * as THREE from "three";
import {
  Components,
  DrawTool,
  ICategory,
  isOrthoSignal,
  modelingSignal,
  ProjectComponent,
} from "@BimModel/src";
import {BaseDraw} from "./BaseDraw";
import {LocationLine} from "@system/geometry";
import {SimpleBeam} from "clay";
import {IDrawType} from "@ModelingComponent/types";
export class DrawLine extends BaseDraw {
  drawType: IDrawType = "Line";
  private locationLine!: LocationLine;
  private count = 0;
  private points: THREE.Vector3[] = [];
  private start: THREE.Vector3 = new THREE.Vector3();
  private end: THREE.Vector3 = new THREE.Vector3();

  get tempElementType() {
    return this.components.tools.get(ProjectComponent).defaultElementTypes[
      "SimpleBeamType"
    ].selectType;
  }
  tempBeam!: SimpleBeam | null;
  /**
   *
   */
  constructor(components: Components, workPlane: THREE.Plane) {
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
    this.points.push(this.start);
    // if the first time user click
    // if another time
    if (this.count >= 1) {
      if (this.locationLine) this.locationLine.visible = false;
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
    const start = this.points[this.points.length - 1];
    if (!this.locationLine)
      this.locationLine = new LocationLine(this.components);
    this.locationLine.update(start, this.end);
    this.locationLine.visible = true;
    this.drawingDimension.updateLine(start, this.end, this.workPlane);
    this.drawingDimension.visible = true;
    if (!this.tempElementType) return;
    if (!this.tempBeam) {
      this.tempBeam = this.tempElementType.addInstance() as SimpleBeam;
      this.modelScene.add(...this.tempBeam.meshes);
    }
    this.tempBeam.startPoint.x = start.x;
    this.tempBeam.startPoint.y = -start.z;
    this.tempBeam.startPoint.z = start.y;
    this.tempBeam.endPoint.x = this.end.x;
    this.tempBeam.endPoint.y = -this.end.z;
    this.tempBeam.endPoint.z = this.end.y;
    this.tempBeam.update(true);
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
      const start = this.points[this.points.length - 1];
      const end = this.getDistance(start, this.end, distance);
      if (this.locationLine) this.locationLine.update(start, end);
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
    if (this.locationLine) this.locationLine.visible = false;
    this.drawingDimension.visible = false;
    this.inputKey = "";
    this.count = 0;
    this.points = [];
  };
  onCallBack = (_value?: number) => {};
  dispose = () => {
    this.drawingDimension.visible = false;
    this.locationLine?.dispose();
    (this.locationLine as any) = null;
    this.count = 0;
    this.points = [];
  };
  private addElement() {
    if (!this.elements || !modelingSignal.value || !this.tempBeam) return;
    const type = modelingSignal.value.type as ICategory;
    const uuid = this.tempBeam.uuid;
    if (!this.elements[type][uuid]) this.elements[type][uuid] = this.tempBeam;
    (this.tempBeam as any) = null;
  }
}
