export type IGridAxis = "X" | "Y" | "Dynamic";

export interface IGrid {
  name: string;
  uuid: string;
  axis: IGridAxis;
  coordinate: number;
  length: number;
}
