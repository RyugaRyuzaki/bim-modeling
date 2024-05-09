import * as WEBIFC from "web-ifc";

export type IBaseParameterValue =
  | "IFCLOGICAL"
  | "IFCBOOLEAN"
  | "IFCREAL"
  | "IFCINTEGER"
  | "IFCIDENTIFIER";
export abstract class BaseParameter {
  abstract name: string;
  abstract value: string;
  abstract valueType: IBaseParameterValue;
}
