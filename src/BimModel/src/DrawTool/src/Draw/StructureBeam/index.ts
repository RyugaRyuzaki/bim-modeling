/**
 * @module StructureBeam
 */
import * as THREE from "three";
import {BaseDrawCategory} from "../BaseDrawCategory";
import {Components} from "@BimModel/src/Components";
import {
  ElementLocation,
  ICategory,
  PsetBeamLevelCommon,
} from "@BimModel/src/system";
import {BeamLine} from "./BeamLine";
import {BeamArc} from "./BeamArc";
import {BeamPickLine} from "./BeamPickLine";
import {BeamRectangular} from "./BeamRectangular";
import {
  ArbitraryClosedProfile,
  IIfcBaseConfig,
  IShapeProfile,
  RectangleProfile,
} from "clay";
import {BeamTypeUtils} from "@BimModel/src/ProjectComponent/src";
import {currentLevelSignal, tempElementSignal} from "@BimModel/src/Signals";
import {IDrawType} from "@ModelingComponent/types";
/**
 *
 */
export class StructureBeam extends BaseDrawCategory {
  /**
   *
   */
  constructor(
    components: Components,
    workPlane: THREE.Plane,
    category: ICategory
  ) {
    super(components, workPlane, category);
    this.draws["Line"] = new BeamLine(this);
    this.draws["Arc"] = new BeamArc(this);
    this.draws["Rectangular"] = new BeamRectangular(this);
    this.draws["PickLine"] = new BeamPickLine(this);
  }
  /**
   *
   */
  async dispose() {
    super.dispose();
  }
  /**
   *
   * @param drawType
   * @returns
   */
  setDrawing = (drawType: IDrawType) => {
    if (!this.draws[drawType]) return;
    if (drawType === "Arc") {
      tempElementSignal.value = this.optionElement["Arc"];
    } else {
      tempElementSignal.value = this.optionElement["Line"];
    }
  };
  /**
   *
   * @param configs
   */
  initInstance(
    configs: {
      config: IIfcBaseConfig;
      profile: RectangleProfile | ArbitraryClosedProfile | IShapeProfile;
    }[]
  ) {
    const lineTypes = BeamTypeUtils.getDefaultBeamTypes(
      this.components.ifcModel,
      configs
    );

    const lineBeam = new ElementLocation(
      this.category,
      this.components,
      lineTypes
    );

    const psetLine = new PsetBeamLevelCommon(currentLevelSignal.value!);

    lineBeam.groupParameter[psetLine.uuid] = psetLine;

    this.optionElement["Line"] = lineBeam;

    const arcTypes = BeamTypeUtils.getArcBeamTypes(
      this.components.ifcModel,
      configs
    );

    const arcBeam = new ElementLocation(
      this.category,
      this.components,
      arcTypes
    );

    const psetArc = new PsetBeamLevelCommon(currentLevelSignal.value!);

    lineBeam.groupParameter[psetArc.uuid] = psetArc;

    this.optionElement["Arc"] = arcBeam;
  }
}
