// import {ILevel} from "@BimModel/src/LevelSystem/types";

// export type IParameterType = "Info" | "Geometry" | "Level" | "Reference";

// export interface IParameter {
//   uuid: string;
//   name: string;
//   type: IParameterType;
//   value: string | number | boolean | IParameter | ILevel;
// }
// export interface IParameterGroup {
//   uuid: string;
//   name: string;
//   HasProperties: {[uuid: string]: IParameter};
// }

export type ICategory =
  | "Wall"
  | "Floor"
  | "Ceiling"
  | "Roof"
  | "Column"
  | "Door"
  | "Window"
  | "Structure Beam"
  | "Structure Column"
  | "Structure Wall"
  | "Structure Slab"
  | "Structure Foundation"
  | "ReinForcement"
  | "Duct"
  | "Pipe"
  | "AirTerminal";
