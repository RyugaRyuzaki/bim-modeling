import {IElement, IElementType} from "clay";
import {LocationArc, LocationLine, LocationPoint} from "../geometry";
import {BaseParameterGroup} from "./Parameter";
import {IBimElementType} from "@ProjectComponent/types";
import {ICategory} from "./types";
import {QsetWallCommon} from "./Parameter/wall/QsetWallCommon";
import {QsetBeamBaseQuantity} from "./Parameter/beam";
import {IAttribute} from "@BimModel/src/system";
import {Disposable} from "@BimModel/src";

export class ElementLocation implements Disposable {
  groupParameter: {[uuid: string]: BaseParameterGroup} = {};
  location!: LocationPoint | LocationArc | LocationLine;
  element!: IElement;

  get attributes(): IAttribute | undefined {
    if (!this.element) return undefined;
    return {
      name: this.element.name,
      globalId: this.element.uuid,
    };
  }
  /**
   *
   */
  constructor(
    public category: ICategory,
    public bimElementTypes: IBimElementType<IElementType>
  ) {}
  async dispose() {
    this.location?.dispose();
    this.element!.type.dispose();
    this.groupParameter = {};
  }
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
  private updateElement() {
    if (!this.element) return;
    for (const uuid in this.groupParameter) {
      this.groupParameter[uuid].updateElement(this.element);
    }
  }
}
