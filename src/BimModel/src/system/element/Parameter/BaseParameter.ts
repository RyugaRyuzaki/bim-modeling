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
  valueIndex = 0;
  abstract uuid: string;
  abstract name: string;
  abstract type: IParameterType;
  abstract list: string[] | number[] | BaseParameter[] | ILevel[];
  abstract value: string | number | boolean | BaseParameter | ILevel;
  abstract element: IElement;
  abstract onValueChange: (
    value: string | number | boolean | BaseParameter | ILevel
  ) => void;
  abstract onValueListChange: (value: number) => void;
  abstract toIfc: () =>
    | IFC.IfcPropertySingleValue
    | IFC.IfcQuantityLength
    | IFC.IfcQuantityArea
    | IFC.IfcQuantityVolume
    | IFC.IfcQuantityWeight
    | IFC.IfcPropertyReferenceValue;
  enable = true;
}
