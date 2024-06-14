import {
  ArbitraryClosedProfile,
  IIfcBaseConfig,
  IShapeProfile,
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
import {currentLevelSignal} from "@BimModel/src/Signals";
import {PsetBeamLevelCommon} from "./Parameter/beam";
import {PsetColumnLevelCommon} from "./Parameter/column";
import {Components} from "@BimModel/src/Components";
import {PsetWallLevelCommon} from "./Parameter/wall";

export class ElementUtils {
  static createWallInstance(
    category: ICategory,
    components: Components,
    model: Model
  ) {
    const types = WallTypeUtils.getDefaultWallTypes(model);
    const wall = new ElementLocation(category, components, types);
    const pset = new PsetWallLevelCommon(currentLevelSignal.value!);
    wall.groupParameter[pset.uuid] = pset;
    return wall;
  }
  static createSlabInstance(
    category: ICategory,
    components: Components,
    model: Model
  ) {
    const slabs = SlabTypeUtils.getDefaultSlabTypes(model);
    return new ElementLocation(category, components, slabs);
  }

  static createWindowInstance(
    category: ICategory,
    components: Components,
    model: Model
  ) {
    const windows = WindowTypeUtils.getDefaultWindowTypes(model);
    return new ElementLocation(category, components, windows);
  }
  static createCurtainWallInstance(
    category: ICategory,
    components: Components,
    model: Model
  ) {
    const curtainWalls = CurtainWallTypeUtils.getDefaultCurtainWallTypes(model);
    return new ElementLocation(category, components, curtainWalls);
  }
  static createColumnInstance(
    category: ICategory,
    components: Components,
    model: Model,
    configs: {
      config: IIfcBaseConfig;
      profile: RectangleProfile | ArbitraryClosedProfile | IShapeProfile;
    }[]
  ) {
    const columns = ColumnTypeUtils.getDefaultColumnTypes(model, configs);
    const column = new ElementLocation(category, components, columns);
    const pset = new PsetColumnLevelCommon(currentLevelSignal.value!);
    column.groupParameter[pset.uuid] = pset;
    return column;
  }
  static createBeamInstance(
    category: ICategory,
    components: Components,
    model: Model,
    configs: {
      config: IIfcBaseConfig;
      profile: RectangleProfile | ArbitraryClosedProfile | IShapeProfile;
    }[]
  ) {
    const types = BeamTypeUtils.getDefaultBeamTypes(model, configs);
    const beam = new ElementLocation(category, components, types);
    const pset = new PsetBeamLevelCommon(currentLevelSignal.value!);
    beam.groupParameter[pset.uuid] = pset;
    return beam;
  }
  static createTempElementInstances(
    components: Components
  ): Record<ICategory, ElementLocation | null> {
    const model = components.ifcModel;
    const profiles = ProfileUtils.createProfiles(model);
    return {
      Wall: this.createWallInstance("Wall", components, model),
      Floor: this.createSlabInstance("Floor", components, model),
      Ceiling: null,
      Roof: null,
      Column: this.createColumnInstance("Column", components, model, profiles),
      Door: null,
      Window: this.createWindowInstance("Window", components, model),
      CurtainWall: null,
      "Structure Beam": this.createBeamInstance(
        "Structure Beam",
        components,
        model,
        profiles
      ),
      "Structure Column": this.createColumnInstance(
        "Structure Column",
        components,
        model,
        profiles
      ),
      "Structure Wall": this.createWallInstance(
        "Structure Wall",
        components,
        model
      ),
      "Structure Slab": this.createSlabInstance(
        "Structure Slab",
        components,
        model
      ),
      "Structure Foundation": null,
      ReinForcement: null,
      Duct: null,
      Pipe: null,
      AirTerminal: null,
    };
  }
}
