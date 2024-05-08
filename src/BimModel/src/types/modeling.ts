import {ReactElement} from "react";

export type IArchitectureModeling =
  | "Wall"
  | "Floor"
  | "Ceiling"
  | "Roof"
  | "Column"
  | "Door"
  | "Window";
export type IStructureModeling =
  | "StructureBeam"
  | "StructureColumn"
  | "StructureWall"
  | "StructureSlab"
  | "StructureFoundation"
  | "ReinForcement";
export type IPlumbingModeling = "Duct" | "Pipe";
export type IDrawType =
  | "Line"
  | "Rectangular"
  | "PolyLines"
  | "Arc"
  | "Cancel"
  | "Finish";
export interface IModeling {
  icon: ReactElement;
  drawType: IDrawType;
}
export type IDiscipline = "Architecture" | "Structure" | "Plumbing";

export interface IModelingTool {
  discipline: IDiscipline;
  types: IArchitecture[] | IStructure[] | IPlumbing[];
}
export interface IArchitecture {
  type: IArchitectureModeling;
  icon: ReactElement;
}
export interface IStructure {
  type: IStructureModeling;
  icon: ReactElement;
}
export interface IPlumbing {
  type: IPlumbingModeling;
  icon: ReactElement;
}
