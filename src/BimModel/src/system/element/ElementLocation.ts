import * as THREE from "three";
import {IFC4X3 as IFC} from "web-ifc";

import {IElement, IElementType, Model} from "clay";
import {LocationArc, LocationLine, LocationPoint} from "../geometry";
import {BaseParameterGroup, LevelParameter} from "./Parameter";
import {IBimElementType} from "@ProjectComponent/types";
import {ICategory} from "./types";
import {QsetWallCommon} from "./Parameter/wall/QsetWallCommon";
import {QsetBeamBaseQuantity} from "./Parameter/beam";
import {IAttribute} from "@BimModel/src/system";
import {
  Disposable,
  Components,
  ProjectComponent,
  MaterialComponent,
} from "@BimModel/src";
import {QsetColumnBaseQuantity} from "./Parameter/column";

export class ElementLocation implements Disposable {
  groupParameter: {[uuid: string]: BaseParameterGroup} = {};
  location!: LocationPoint | LocationArc | LocationLine;
  element!: IElement;
  get ProjectComponent() {
    return this.components.tools.get(ProjectComponent);
  }
  get materialCategories() {
    return this.components.tools.get(MaterialComponent)?.materialCategories;
  }
  get elements() {
    return this.ProjectComponent?.elements;
  }
  get attributes(): IAttribute | undefined {
    if (!this.element) return undefined;
    return {
      name: this.element.name,
      globalId: this.element.uuid,
    };
  }
  private _select = false;
  set select(select: boolean) {
    if (this._select === select) return;
    this._select = select;
    if (this.location) {
      this.location.visible = select;
    }
  }
  getLevelParameter(): LevelParameter | null {
    if (Object.keys(this.groupParameter).length === 0) return null;
    for (const key in this.groupParameter) {
      const group = this.groupParameter[key];
      const level = group.getLevelParameter();
      if (level) return level;
    }
    return null;
  }
  /**
   *
   */
  constructor(
    public category: ICategory,
    public components: Components,
    public bimElementTypes: IBimElementType<IElementType>
  ) {}
  async dispose() {
    this.location?.dispose();
    this.element!.type.dispose();
    this.groupParameter = {};
  }
  onChangeLength = (length: number) => {
    if (!this.element || !this.location) return;
    if (!(this.location instanceof LocationLine)) return;
    this.location.updateLength(length);
    if (this.element.updateLocation)
      this.element.updateLocation(this.location.location);
    this.components.modelScene.add(...this.element.clones);
    this.updateElement();
  };
  onMove = (origin: THREE.Vector3, movingPoint: THREE.Vector3) => {
    if (!this.element || !this.location) return;
    if (this.location instanceof LocationLine) {
      this.location.updateMove(origin, movingPoint);
    } else if (this.location instanceof LocationArc) {
      //
    } else if (this.location instanceof LocationPoint) {
      this.location.update(movingPoint);
    }

    if (this.element.updateLocation)
      this.element.updateLocation(this.location.location);
    this.components.modelScene.add(...this.element.clones);
    this.updateElement();
  };
  onCopy = (origin: THREE.Vector3, movingPoint: THREE.Vector3) => {
    if (!this.element || !this.location) return;
    const material = this.materialCategories[this.category];
    const currentElementIndex = Object.keys(
      this.ProjectComponent.elements
    ).length;
    if (this.location instanceof LocationLine) {
      const location = this.location.onClone();
      location.updateMove(origin, movingPoint);
      const element = this.element.onClone(material!) as IElement;
      element.updateDraw(location.location);
      element.attributes.Name = new IFC.IfcLabel(
        `${this.category} ${currentElementIndex + 1}`
      );
      const elementLocation = this.ProjectComponent.setElement(
        this.category,
        this.bimElementTypes,
        element,
        location
      );
      elementLocation.clonePset();
    } else if (this.location instanceof LocationArc) {
      //
    } else if (this.location instanceof LocationPoint) {
      //
    }
  };

  addQsetWallCommon() {
    const qset = new QsetWallCommon();
    this.groupParameter[qset.uuid] = qset;
    this.updateElement();
  }
  addQsetBeamCommon() {
    const qset = new QsetBeamBaseQuantity();
    this.groupParameter[qset.uuid] = qset;
    this.updateElement();
  }
  addQsetColumnCommon() {
    const qset = new QsetColumnBaseQuantity();
    this.groupParameter[qset.uuid] = qset;
    this.updateElement();
  }
  export() {
    if (!this.element) return;
    const IfcOwnerHistory = this.components.ifcModel.IfcOwnerHistory;
    this.element.attributes.OwnerHistory = IfcOwnerHistory;
    for (const uuid in this.groupParameter) {
      this.groupParameter[uuid].export(
        this.components.ifcModel,
        IfcOwnerHistory
      );
    }
  }
  private updateElement() {
    if (!this.element) return;
    for (const uuid in this.groupParameter) {
      this.groupParameter[uuid].updateElement(this.element);
    }
  }
  private clonePset() {
    switch (this.category) {
      case "Structure Beam":
        this.addQsetBeamCommon();
        break;
      case "Wall":
      case "Structure Wall":
        this.addQsetWallCommon();
        break;
      case "Structure Column":
        this.addQsetColumnCommon();
        break;
      default:
        break;
    }
  }
}
