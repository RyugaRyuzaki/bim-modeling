import {Model} from "clay";
import {ICategory} from "./types";
import {
  BeamTypeUtils,
  ColumnTypeUtils,
  CurtainWallTypeUtils,
  SlabTypeUtils,
  WallTypeUtils,
  WindowTypeUtils,
} from "@ProjectComponent/src";
import {ElementLocation} from "./ElementLocation";
import {PsetWallLevelCommon} from "./Parameter";
import {currentLevelSignal} from "@BimModel/src/Signals";
import {PsetBeamLevelCommon} from "./Parameter/beam";

export class ElementUtils {
  static createWallInstance(category: ICategory, model: Model) {
    const types = WallTypeUtils.getDefaultWallTypes(model);
    const wall = new ElementLocation(category, types);
    const pset = new PsetWallLevelCommon(currentLevelSignal.value!);
    wall.groupParameter[pset.uuid] = pset;
    return wall;
  }
  static createSlabInstance(category: ICategory, model: Model) {
    const slabs = SlabTypeUtils.getDefaultSlabTypes(model);
    return new ElementLocation(category, slabs);
  }
  static createColumnInstance(category: ICategory, model: Model) {
    const columns = ColumnTypeUtils.getDefaultColumnTypes(model);
    return new ElementLocation(category, columns);
  }
  static createWindowInstance(category: ICategory, model: Model) {
    const windows = WindowTypeUtils.getDefaultWindowTypes(model);
    return new ElementLocation(category, windows);
  }
  static createCurtainWallInstance(category: ICategory, model: Model) {
    const curtainWalls = CurtainWallTypeUtils.getDefaultCurtainWallTypes(model);
    return new ElementLocation(category, curtainWalls);
  }
  static createBeamInstance(category: ICategory, model: Model) {
    const types = BeamTypeUtils.getDefaultBeamTypes(model);
    const beam = new ElementLocation(category, types);
    const pset = new PsetBeamLevelCommon(currentLevelSignal.value!);
    beam.groupParameter[pset.uuid] = pset;
    return beam;
  }
  static createTempElementInstances(
    model: Model
  ): Record<ICategory, ElementLocation | null> {
    return {
      Wall: this.createWallInstance("Wall", model),
      Floor: this.createSlabInstance("Floor", model),
      Ceiling: null,
      Roof: null,
      Column: this.createColumnInstance("Column", model),
      Door: null,
      Window: this.createWindowInstance("Window", model),
      CurtainWall: this.createCurtainWallInstance("CurtainWall", model),
      "Structure Beam": this.createBeamInstance("Structure Beam", model),
      "Structure Column": this.createColumnInstance("Structure Column", model),
      "Structure Wall": this.createWallInstance("Structure Wall", model),
      "Structure Slab": this.createSlabInstance("Structure Slab", model),
      "Structure Foundation": null,
      ReinForcement: null,
      Duct: null,
      Pipe: null,
      AirTerminal: null,
    };
  }
}
