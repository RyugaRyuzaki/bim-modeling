export interface IBaseElementType {
  typeName: string;
  typeEnum: IElementTypeEnum;
}

export type IElementTypeEnum =
  | "WallType"
  | "BeamType"
  | "ColumnType"
  | "FoundationType"
  | "ReinforcementType"
  | "SlabType";
