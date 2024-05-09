import * as WEBIFC from "web-ifc";
import {IfcCategoryMap} from "./IfcCategoryMap";
export type IfcClass = (typeof WEBIFC)[keyof typeof WEBIFC] extends string
  ? keyof typeof WEBIFC
  : never;

export abstract class BaseCategory<IfcClass> {
  abstract categoryName: IfcClass;
}
