import {ILevel} from "@BimModel/src/LevelSystem/types";
import {IElement} from "clay";
import {IFC4X3 as IFC} from "web-ifc";

export type IParameterType =
  | "InputString"
  | "InputNumber"
  | "InputCount"
  | "List"
  | "Reference";
/**
 *
 */
export abstract class BaseParameter {
  abstract uuid: string;
  abstract name: string;
  abstract type: IParameterType;
  abstract value: string | number | boolean | BaseParameter | ILevel;
  abstract list: ILevel[] | any[];
  abstract onValueChange: (
    value: string | number | boolean | BaseParameter | ILevel
  ) => void;
  abstract toIfc: () =>
    | IFC.IfcPropertySingleValue
    | IFC.IfcPropertyReferenceValue;
  enable = true;
  constructor(public element: IElement) {}
}
