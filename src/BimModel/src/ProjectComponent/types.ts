export type IUnitSymbol = "m" | "cm" | "mm";
export type IUnitLength = "m" | "cm" | "mm";
export type IUnitArea = "m²" | "cm²" | "mm²";
export type IUnitVolume = "m³" | "cm³" | "mm³";

export interface IUnit {
  factor: number;
  toFixed: number;
  symbol: IUnitLength | IUnitArea | IUnitVolume;
}
export type ILineType = "thin" | "thickness";
export interface IProjectInfo {
  address: string;
}
export interface IProject {
  info: IProjectInfo;
}
