import {ReactElement, ReactNode} from "react";

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
export interface IModeling {
  icon: ReactElement;
  drawType: IDrawType;
  onClick?: (drawType: IDrawType) => void;
}

export interface IModelingTool {
  discipline: string;
  type: string;
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
