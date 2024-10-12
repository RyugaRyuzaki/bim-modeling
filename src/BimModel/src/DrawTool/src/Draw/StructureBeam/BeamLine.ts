/**
 * @module StructureBeam
 */
import {IElement, SimpleBeam} from "clay";
import {DrawLine} from "../DrawLine";
import {modelStructureSignal, tempElementSignal} from "@BimModel/src/Signals";
import {IFC4X3 as IFC} from "web-ifc";

/**
 *
 */
export class BeamLine extends DrawLine {
  tempElement!: IElement;

  disposeElement = () => {
    this.Snapper.snapper = null;
    if (!this.tempElement) return;
    for (const mesh of this.tempElement.meshes) {
      mesh.removeFromParent();
    }
    this.tempElement.type.deleteInstance(this.tempElement.attributes.expressID);
    (this.tempElement as any) = null;
  };

  addElement = () => {
    if (
      !this.tempElement ||
      !tempElementSignal.value ||
      !modelStructureSignal.value
    )
      return;
    const elementLocation = this.ProjectComponent.setElement(
      this.category.category,
      tempElementSignal.value.bimElementTypes,
      this.tempElement,
      this.location
    );
    elementLocation.groupParameter = {
      ...tempElementSignal.value.groupParameter,
    };
    this.ProjectComponent.ifcProject.addElementLevel = elementLocation;
    elementLocation.addQsetBeamCommon();
    (this.tempElement as any) = null;
    (this.location as any) = null;
  };

  createElement = () => {
    if (!tempElementSignal.value) return;
    const {selectType} = tempElementSignal.value.bimElementTypes;
    if (!selectType) return;
    const currentElementIndex = Object.keys(
      this.ProjectComponent.elements
    ).length;
    if (!this.tempElement) {
      this.tempElement = selectType.addInstance(
        this.MaterialComponent.materialCategories[this.category.category]!
      ) as SimpleBeam;
      this.tempElement.attributes.Name = new IFC.IfcLabel(
        `${this.category.category} ${currentElementIndex + 1}`
      );
      (this.tempElement as SimpleBeam).updateOffsetLevel({});
    }
    this.components.modelScene.updateMatrixWorld(true);
    if (this.tempElement)
      this.components.modelScene.add(...this.tempElement.meshes);
  };

  updateElement = () => {
    if (!this.tempElement || !this.location) return;
    this.tempElement.updateDraw(this.location.location);
  };
}
