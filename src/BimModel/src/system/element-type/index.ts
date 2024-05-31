import {BeamType} from "./BeamType";
import {ColumnType} from "./ColumnType";
import {FoundationType} from "./FoundationType";
import {ReinforcementType} from "./ReinforcementType";
import {SlabType} from "./SlabType";
import {WallType} from "./WallType";

export * from "./BaseElementType";
export * from "./BeamType";
export * from "./ColumnType";
export * from "./FoundationType";
export * from "./ReinforcementType";
export * from "./SlabType";
export * from "./WallType";
export * from "./types";
export class ElementTypeSystem {
  static createWallInstance(): WallType[] {
    return [new WallType("BW100"), new WallType("BW200")];
  }
  static createBeamInstance(): BeamType[] {
    return [new BeamType("R200x400"), new BeamType("R200x300")];
  }
  static createColumnInstance(): ColumnType[] {
    return [new ColumnType("R200x400"), new ColumnType("R200x300")];
  }
  static createSlabInstance(): SlabType[] {
    return [new SlabType("R200x400"), new SlabType("R200x300")];
  }
  static createFoundationInstance(): FoundationType[] {
    return [new FoundationType("R200x400"), new FoundationType("R200x300")];
  }
  static createReinforcementInstance(): ReinforcementType[] {
    return [
      new ReinforcementType("R200x400"),
      new ReinforcementType("R200x300"),
    ];
  }
}
