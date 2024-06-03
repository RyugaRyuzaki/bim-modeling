import * as THREE from "three";
import {Components} from "@BimModel/src/Components";
import {BaseDraw} from "./BaseDraw";
import {IDrawType} from "@ModelingComponent/types";
import {ProjectComponent} from "@BimModel/src/ProjectComponent";
import {SimpleColumn} from "clay";
import {modelingSignal} from "@BimModel/src/Signals";
import {ICategory} from "@BimModel/src/system";

export class DrawPoint extends BaseDraw {
  drawType: IDrawType = "Point";
  get tempElementType() {
    return this.components.tools.get(ProjectComponent).defaultElementTypes[
      "SimpleColumnType"
    ].selectType;
  }
  tempColumn!: SimpleColumn | null;
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
    if (!this.foundPoint || this.mousedown) return;
    this.RaycasterComponent!.updateInfo(this.foundPoint);
    if (!this.tempElementType) return;
    if (!this.tempColumn) {
      this.tempColumn = this.tempElementType.addInstance() as SimpleColumn;
      this.modelScene.add(...this.tempColumn.meshes);
    }
    this.tempColumn.position.x = this.foundPoint.x;
    this.tempColumn.position.y = -this.foundPoint.z;
    this.tempColumn.position.z = this.foundPoint.y;
    this.tempColumn.update(true);
  };
  onMousedown = (_e: MouseEvent) => {
    if (_e.button === 0) this.mousedown = true;
  };
  onKeyDown = (_e: KeyboardEvent) => {};

  onFinished = () => {
    this.drawingDimension.visible = false;
    this.addElement();
  };
  onCallBack = (_value?: number) => {};
  dispose = () => {
    this.drawingDimension.visible = false;
  };
  private addElement() {
    if (!this.elements || !modelingSignal.value || !this.tempColumn) return;
    const type = modelingSignal.value.type as ICategory;
    const uuid = this.tempColumn.uuid;
    if (!this.elements[type][uuid]) this.elements[type][uuid] = this.tempColumn;
    (this.tempColumn as any) = null;
  }
}
