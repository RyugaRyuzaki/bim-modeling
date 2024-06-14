import {ReactElement, ReactNode} from "react";
import {ICategory} from "../system";

export type IDrawType =
  | "Line"
  | "Rectangular"
  | "PolyLines"
  | "Arc"
  | "Circle"
  | "Cancel"
  | "Finish"
  | "Point"
  | "PickLine"
  | "None";
export type IModify = "Copy" | "Move" | "Trim" | "Extend" | "Align";
export type IModelingTab =
  | "Files"
  | "Architecture"
  | "Structure"
  | "Plumbing"
  | "Modify";

export interface IModeling {
  icon: ReactElement;
  drawType: IDrawType;
  onClick?: (drawType: IDrawType) => void;
}

export interface IModelingTool {
  discipline: string;
  type: ICategory;
}
export interface IModelingToolTabs {
  discipline: string;
  types: ITool[];
}
export interface ITool {
  type: string;
  icon: ReactNode;
}
export type IVisibility = "3D" | "Plane" | "Elevation";
export interface IVisibilityButton {
  tooltip: IVisibility;
  icon: ReactNode;
}
