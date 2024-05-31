import {ILevel} from "@BimModel/src/LevelSystem/types";

export type IParameterType = "Info" | "Geometry" | "Level" | "Reference";

export interface IParameter {
  id: number;
  uuid: string;
  name: string;
  type: IParameterType;
  value: string | number | boolean | IParameter | ILevel;
}
export interface IParameterGroup {
  id: number;
  uuid: string;
  name: string;
  HasProperties: {[uuid: string]: IParameter};
}
