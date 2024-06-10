import * as THREE from "three";
import {Components} from "@BimModel/src/Components";
import {BaseDraw} from "./BaseDraw";
import {IDrawType} from "@ModelingComponent/types";
import {LocationArc, LocationLine, LocationPoint} from "@BimModel/src/system";
import {
  modelingSignal,
  modelStructureSignal,
  tempElementSignal,
} from "@BimModel/src/Signals";
import {IFC4X3 as IFC} from "web-ifc";
import {SimpleColumn} from "clay";

export class DrawPoint extends BaseDraw {
  drawType: IDrawType = "Point";
  private locationPoint!: LocationPoint;
  /**
   *
   */
  constructor(components: Components, workPlane: THREE.Plane) {
    super(components, workPlane);
  }
  onClick = (_e: MouseEvent) => {
    if (!this.foundPoint || this.mousedown) return;
    this.addElement();
  };
  onMouseMove = (_e: MouseEvent) => {
    this.findPoint = _e;
    this.Snapper.find = _e;
    if (!this.foundPoint || this.mousedown) return;
    this.RaycasterComponent!.updateInfo(this.foundPoint);
    const point = this.foundPoint.clone();
    if (this.Snapper.snap) point.copy(this.Snapper.snap);
    if (!this.locationPoint)
      this.locationPoint = new LocationPoint(this.components);
    this.locationPoint.update(point);
    this.locationPoint.visible = true;
    this.createElement();
    this.updateElement(this.locationPoint);
  };
  onMousedown = (_e: MouseEvent) => {
    if (_e.button === 0) this.mousedown = true;
  };
  onKeyDown = (_e: KeyboardEvent) => {
    if (_e.key === " ") {
      if (!tempElementSignal.value || !modelingSignal.value) return;
      const {selectType} = tempElementSignal.value.bimElementTypes;
      if (!selectType) return;
      const {type} = modelingSignal.value;
      if (!this.tempElement) return;
      switch (type) {
        case "Column":
        case "Structure Column":
          this.tempElement.rotation.z =
            this.tempElement.rotation.z + Math.PI / 4;
          this.tempElement.update(true);
          break;
        default:
          break;
      }
    }
  };

  onFinished = () => {
    this.addElement();
  };
  onCallBack = (_value?: number) => {};
  dispose = () => {
    this.disposeElement();
    this.locationPoint?.dispose();
    (this.locationPoint as any) = null;
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
      this.locationPoint
    );
    element.groupParameter = {...tempElementSignal.value.groupParameter};
    switch (type) {
      case "Structure Beam":
      case "Structure Wall":
      case "Structure Slab":
      case "Structure Foundation":
      case "ReinForcement":
        break;
      case "Structure Column":
        element.addQsetColumnCommon();
        break;
      default:
        break;
    }
    (this.tempElement as any) = null;
    (this.locationPoint as any) = null;
  };
  createElement = () => {
    if (!tempElementSignal.value || !modelingSignal.value) return;
    const {selectType} = tempElementSignal.value.bimElementTypes;
    if (!selectType) return;
    const {type} = modelingSignal.value;
    switch (type) {
      case "Structure Beam":
      case "Structure Wall":
      case "Structure Slab":
      case "Structure Foundation":
      case "ReinForcement":
        break;
      case "Structure Column":
        if (!this.tempElement) {
          this.tempElement = selectType.addInstance(
            this.MaterialComponent.materialCategories[type]!
          ) as SimpleColumn;
          this.tempElement.attributes.Name = new IFC.IfcLabel(
            `${type} ${this.CurrentElementIndex + 1}`
          );
        }
        break;
      default:
        break;
    }
    this.components.modelScene.updateMatrixWorld(true);
    if (this.tempElement)
      this.components.modelScene.add(...this.tempElement.meshes);
  };
  updateElement = (_location: LocationPoint | LocationArc | LocationLine) => {
    if (!tempElementSignal.value || !modelingSignal.value) return;
    const {selectType} = tempElementSignal.value.bimElementTypes;
    if (!selectType) return;
    const {type} = modelingSignal.value;
    if (!this.tempElement) return;
    if (!this.locationPoint) return;
    switch (type) {
      case "Structure Beam":
      case "Structure Wall":
      case "Structure Slab":
      case "Structure Foundation":
      case "ReinForcement":
        break;
      case "Structure Column":
        this.tempElement.position.x = this.locationPoint.location.point.x;
        this.tempElement.position.y = -this.locationPoint.location.point.z;
        this.tempElement.position.z = this.locationPoint.location.point.y;
        this.tempElement.update(true);
        break;
      default:
        break;
    }
  };
}
