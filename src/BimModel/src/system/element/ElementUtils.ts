import {
  ArbitraryClosedProfile,
  IIfcBaseConfig,
  Model,
  RectangleProfile,
} from "clay";
import {ICategory} from "./types";
import {
  BeamTypeUtils,
  ColumnTypeUtils,
  CurtainWallTypeUtils,
  ProfileUtils,
  SlabTypeUtils,
  WallTypeUtils,
  WindowTypeUtils,
} from "@ProjectComponent/src";
import {ElementLocation} from "./ElementLocation";
import {PsetWallLevelCommon} from "./Parameter";
import {currentLevelSignal} from "@BimModel/src/Signals";
import {PsetBeamLevelCommon} from "./Parameter/beam";
import {PsetColumnLevelCommon} from "./Parameter/Column";

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

  static createWindowInstance(category: ICategory, model: Model) {
    const windows = WindowTypeUtils.getDefaultWindowTypes(model);
    return new ElementLocation(category, windows);
  }
  static createCurtainWallInstance(category: ICategory, model: Model) {
    const curtainWalls = CurtainWallTypeUtils.getDefaultCurtainWallTypes(model);
    return new ElementLocation(category, curtainWalls);
  }
  static createColumnInstance(
    category: ICategory,
    model: Model,
    configs: {
      config: IIfcBaseConfig;
      profile: RectangleProfile | ArbitraryClosedProfile;
    }[]
  ) {
    const columns = ColumnTypeUtils.getDefaultColumnTypes(model, configs);
    const column = new ElementLocation(category, columns);
    const pset = new PsetColumnLevelCommon(currentLevelSignal.value!);
    column.groupParameter[pset.uuid] = pset;
    return column;
  }
  static createBeamInstance(
    category: ICategory,
    model: Model,
    configs: {
      config: IIfcBaseConfig;
      profile: RectangleProfile | ArbitraryClosedProfile;
    }[]
  ) {
    const types = BeamTypeUtils.getDefaultBeamTypes(model, configs);
    const beam = new ElementLocation(category, types);
    const pset = new PsetBeamLevelCommon(currentLevelSignal.value!);
    beam.groupParameter[pset.uuid] = pset;
    return beam;
  }
  static createTempElementInstances(
    model: Model
  ): Record<ICategory, ElementLocation | null> {
    const profiles = ProfileUtils.createProfiles(model);
    return {
      Wall: this.createWallInstance("Wall", model),
      Floor: this.createSlabInstance("Floor", model),
      Ceiling: null,
      Roof: null,
      Column: this.createColumnInstance("Column", model, profiles),
      Door: null,
      Window: this.createWindowInstance("Window", model),
      CurtainWall: this.createCurtainWallInstance("CurtainWall", model),
      "Structure Beam": this.createBeamInstance(
        "Structure Beam",
        model,
        profiles
      ),
      "Structure Column": this.createColumnInstance(
        "Structure Column",
        model,
        profiles
      ),
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
