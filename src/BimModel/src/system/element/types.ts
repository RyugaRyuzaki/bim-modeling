export type ICategory =
  | "Wall"
  | "Floor"
  | "Ceiling"
  | "Roof"
  | "Column"
  | "Door"
  | "Window"
  | "CurtainWall"
  | "Structure Beam"
  | "Structure Column"
  | "Structure Wall"
  | "Structure Slab"
  | "Structure Foundation"
  | "ReinForcement"
  | "Duct"
  | "Pipe"
  | "AirTerminal";

export interface IAttribute {
  name: string;
  globalId: string;
}
