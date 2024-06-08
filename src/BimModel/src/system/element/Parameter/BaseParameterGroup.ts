import {IElement} from "clay";
import {BaseParameter} from "./BaseParameter";
import {IFC4X3 as IFC} from "web-ifc";
/**
 *
 */
export abstract class BaseParameterGroup {
  abstract uuid: string;
  abstract name: string;
  abstract HasProperties: {[uuid: string]: BaseParameter};
  abstract element: IElement;
  abstract toIfc: () => IFC.IfcPropertySet;
  /**
   *
   */
}
