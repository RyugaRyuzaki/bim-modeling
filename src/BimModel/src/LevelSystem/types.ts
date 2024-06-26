import * as THREE from "three";

export interface ILevel {
  name: string;
  index: number;
  elevation: number;
  uuid: string;
  plane: THREE.Plane;
}
export type IViewType = "3D" | "Plan" | "Elevation" | "Section" | "Browsers";
export type IElevation = "South" | "West" | "East" | "North";

export interface IView {
  name: string;
  uuid: string;
  viewType: IViewType;
  checked: boolean;
  elevationType?: IElevation;
  level?: ILevel;
  onActive: (view: IView) => void;
  children: {[uuid: string]: IView};
}
