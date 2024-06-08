import {IElement, IElementType} from "clay";
import {LocationArc, LocationLine, LocationPoint} from "../geometry";
import {BaseParameterGroup} from "./Parameter";
import {IBimElementType} from "@ProjectComponent/types";
import {ICategory} from "./types";
import {QsetWallCommon} from "./Parameter/wall/QsetWallCommon";
import {QsetBeamBaseQuantity} from "./Parameter/beam";

export class ElementLocation {
  groupParameter: {[uuid: string]: BaseParameterGroup} = {};
  location!: LocationPoint | LocationArc | LocationLine;
  element!: IElement;
  /**
   *
   */
  constructor(
    public category: ICategory,
    public bimElementTypes: IBimElementType<IElementType>
  ) {}
  addQsetWallCommon() {
    const qset = new QsetWallCommon();
    this.groupParameter[qset.uuid] = qset;
  }
  addQsetBeamCommon() {
    const qset = new QsetBeamBaseQuantity();
    this.groupParameter[qset.uuid] = qset;
  }
}
