/**
 * @module DrawLine
 */
import * as THREE from "three";
import {IFC4X3 as IFC} from "web-ifc";

import {
  Components,
  isOrthoSignal,
  modelingSignal,
  modelStructureSignal,
  tempElementSignal,
} from "@BimModel/src";
import {BaseDraw} from "./BaseDraw";
import {LocationArc, LocationLine, LocationPoint} from "@system/geometry";
import {IDrawType} from "@ModelingComponent/types";
import {SimpleBeam, SimpleWall} from "clay";
export class DrawLine extends BaseDraw {
  drawType: IDrawType = "Line";
  private locationLine!: LocationLine;
  private count = 0;
  private points: THREE.Vector3[] = [];
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
    this.Snapper.find = _e;
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
    this.createElement();
    this.updateElement(this.locationLine);
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
    this.disposeElement();
    this.drawingDimension.visible = false;
    this.locationLine?.dispose();
    (this.locationLine as any) = null;
    this.count = 0;
    this.points = [];
  };
  addElement = () => {
    if (
      !this.tempElement ||
      !tempElementSignal.value ||
      !modelingSignal.value ||
      !modelStructureSignal.value
    )
      return;
    const {type} = modelingSignal.value;
    const bimElementTypes = {...tempElementSignal.value.bimElementTypes};
    const element = this.ProjectComponent.setElement(
      type,
      bimElementTypes,
      this.tempElement,
      this.locationLine
    );
    element.groupParameter = {...tempElementSignal.value.groupParameter};
    switch (type) {
      case "Structure Beam":
        element.addQsetBeamCommon();
        break;
      case "Structure Wall":
        element.addQsetWallCommon();
        break;
      case "Structure Column":
      case "Structure Slab":
      case "Structure Foundation":
      case "ReinForcement":
        break;
      default:
        break;
    }
    (this.tempElement as any) = null;
    (this.locationLine as any) = null;
  };
  createElement = () => {
    if (!tempElementSignal.value || !modelingSignal.value) return;
    const {selectType} = tempElementSignal.value.bimElementTypes;
    if (!selectType) return;
    const {type} = modelingSignal.value;
    switch (type) {
      case "Structure Beam":
        if (!this.tempElement)
          this.tempElement = selectType.addInstance(
            this.MaterialComponent.BeamMaterial
          ) as SimpleBeam;
        this.tempElement.attributes.Name = new IFC.IfcLabel(
          `${type} ${this.CurrentElementIndex + 1}`
        );
        break;
      case "Structure Wall":
        if (!this.tempElement)
          this.tempElement = selectType.addInstance(
            this.MaterialComponent.WallMaterial
          ) as SimpleWall;

        this.tempElement.attributes.Name = new IFC.IfcLabel(
          `${type} ${this.CurrentElementIndex + 1}`
        );

        break;
      case "Structure Column":
      case "Structure Slab":
      case "Structure Foundation":
      case "ReinForcement":
        break;
      default:
        break;
    }
    this.components.modelScene.updateMatrixWorld(true);
    if (this.tempElement)
      this.components.modelScene.add(...this.tempElement.meshes);
  };

  updateElement = (location: LocationPoint | LocationArc | LocationLine) => {
    if (!tempElementSignal.value || !modelingSignal.value) return;
    const {selectType} = tempElementSignal.value.bimElementTypes;
    if (!selectType) return;
    const {type} = modelingSignal.value;
    if (!this.tempElement) return;
    if (!(location instanceof LocationLine)) return;
    const {start, end} = location.location;
    switch (type) {
      case "Structure Beam":
        (this.tempElement as SimpleBeam).startPoint.x = start.x;
        (this.tempElement as SimpleBeam).startPoint.y = -start.z;
        (this.tempElement as SimpleBeam).startPoint.z = start.y;
        (this.tempElement as SimpleBeam).endPoint.x = end.x;
        (this.tempElement as SimpleBeam).endPoint.y = -end.z;
        (this.tempElement as SimpleBeam).endPoint.z = end.y;
        (this.tempElement as SimpleBeam).update(true);
        break;
      case "Structure Wall":
        (this.tempElement as SimpleWall).startPoint.x = start.x;
        (this.tempElement as SimpleWall).startPoint.y = -start.z;
        (this.tempElement as SimpleWall).startPoint.z = start.y;
        (this.tempElement as SimpleWall).endPoint.x = end.x;
        (this.tempElement as SimpleWall).endPoint.y = -end.z;
        (this.tempElement as SimpleWall).endPoint.z = end.y;
        (this.tempElement as SimpleWall).update(true, true);
        break;
      case "Structure Column":
      case "Structure Slab":
      case "Structure Foundation":
      case "ReinForcement":
        break;
      default:
        break;
    }
  };
  disposeElement() {
    if (!this.tempElement) return;
    for (const mesh of this.tempElement.meshes) {
      mesh.removeFromParent();
    }
    this.tempElement.type.deleteInstance(this.tempElement.attributes.expressID);
    (this.tempElement as any) = null;
  }
}
