import {ReactElement, ReactNode} from "react";

export type IArchitectureModeling =
  | "Wall"
  | "Floor"
  | "Ceiling"
  | "Roof"
  | "Column"
  | "Door"
  | "Window";
export type IStructureModeling =
  | "Structure Beam"
  | "Structure Column"
  | "Structure Wall"
  | "Structure Slab"
  | "Structure Foundation"
  | "ReinForcement";
export type IPlumbingModeling = "Duct" | "Pipe";
export type IModify = "Copy" | "Move" | "Trim" | "Extend";
export type IFile =
  | "New Project"
  | "Open"
  | "Save"
  | "Export Ifc"
  | "Export .bim"
  | "Export .glb";
export type IDrawType =
  | "Line"
  | "Rectangular"
  | "PolyLines"
  | "Arc"
  | "Cancel"
  | "Finish"
  | "Point"
  | "None";
export interface IModeling {
  icon: ReactElement;
  drawType: IDrawType;
  onClick?: (drawType: IDrawType) => void;
}
export type IDiscipline =
  | "Files"
  | "Architecture"
  | "Structure"
  | "Plumbing"
  | "Modify";

export interface IModelingTool {
  discipline: IDiscipline;
  type:
    | IArchitectureModeling
    | IStructureModeling
    | IPlumbingModeling
    | IFile
    | IModify;
}
export interface IModelingToolTabs {
  discipline: IDiscipline;
  types: ITool[];
}
export interface ITool {
  type:
    | IArchitectureModeling
    | IStructureModeling
    | IPlumbingModeling
    | IFile
    | IModify;
  icon: ReactNode;
}
