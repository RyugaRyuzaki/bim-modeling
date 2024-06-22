/**
 *  @module ifc
 */
import {IfcUtils, Model} from "clay";
import {IFC4X3 as IFC} from "web-ifc";
import {v4 as uuidv4} from "uuid";
import {SpatialStructure} from "./SpatialStructure";
import {ILevel} from "@BimModel/src/LevelSystem/types";
import {IIfcProjectConfig} from "./types";
import {defaultLevels} from "@BimModel/src/LevelSystem/constants";
import {ElementLocation} from "@BimModel/src/system";
import {lengthUnitSignal} from "@BimModel/src/Signals";
import {effect} from "@preact/signals-react";
const defaultProjectConfig: IIfcProjectConfig = {
  Name: "Bim-modeling",
  Description: "",
  ObjectType: "3D Web application modeling",
  Phase: "Phase 1",
};

/**
 *https://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/IfcProject.htm
 */

export class IfcProject {
  get IfcUnitAssignment() {
    return this.model.ifcInfo.ifcUnit.IfcUnitAssignment;
  }
  get IfcOwnerHistory() {
    return this.model.ifcInfo.IfcOwnerHistory;
  }
  get IfcSiteAddress() {
    return this.model.ifcInfo.IfcSiteAddress;
  }
  get IfcBuildingAddress() {
    return this.model.ifcInfo.IfcBuildingAddress;
  }
  modelStructure!: SpatialStructure;
  buildingStructure!: SpatialStructure;

  set addLevel(level: ILevel) {
    const ifcBuildingStorey = this.getIfcBuildingStorey(level);
    const structureLevel = new SpatialStructure(ifcBuildingStorey);
    structureLevel.Decomposed =
      this.RelContainedInSpatialStructure(ifcBuildingStorey);
    this.buildingStructure.child = structureLevel;
  }
  set addElementLevel(element: ElementLocation) {
    if (!element.element) return;
    const levelParam = element.getLevelParameter();
    if (!levelParam || !levelParam.value) return;
    const buildingStorey = this.getLevel(levelParam.value);
    if (!buildingStorey) return;
    buildingStorey.child = new SpatialStructure(element.element.attributes);
  }

  /**
   *
   */
  constructor(private model: Model) {
    this.initIfcProject();
    effect(() => {
      const {symbol} = lengthUnitSignal.value;
      const {IfcLengthUnit, IfcAreaUnit, IfcVolumeUnit} =
        this.model.ifcInfo.ifcUnit;
      if (symbol === "cm") {
        IfcLengthUnit.Prefix = IFC.IfcSIPrefix.CENTI;
        IfcAreaUnit.Prefix = IFC.IfcSIPrefix.CENTI;
        IfcVolumeUnit.Prefix = IFC.IfcSIPrefix.CENTI;
      } else if (symbol === "mm") {
        IfcLengthUnit.Prefix = IFC.IfcSIPrefix.MILLI;
        IfcAreaUnit.Prefix = IFC.IfcSIPrefix.MILLI;
        IfcVolumeUnit.Prefix = IFC.IfcSIPrefix.MILLI;
      }
    });
  }

  export() {
    this.model.ifcInfo.export();
    this.model.set(this.modelStructure.ifc);
    this.model.set(this.modelStructure.Decomposed);
    for (const [_id, child] of this.modelStructure.children) {
      this.exportItem(child);
    }
  }
  private exportItem(structure: SpatialStructure) {
    this.model.set(structure.ifc);
    if (!structure.Decomposed) return;
    this.model.set(structure.Decomposed);
    for (const [_id, child] of structure.children) {
      this.exportItem(child);
    }
  }
  private getLevel(level: ILevel) {
    if (!this.buildingStructure) throw new Error();
    return this.buildingStructure.children.get(level.uuid);
  }

  private initIfcProject() {
    const {Name, Description, ObjectType, Phase} = defaultProjectConfig;
    const ifcProject = new IFC.IfcProject(
      new IFC.IfcGloballyUniqueId(uuidv4()),
      this.IfcOwnerHistory,
      new IFC.IfcLabel(Name),
      new IFC.IfcText(Description),
      new IFC.IfcLabel(ObjectType),
      new IFC.IfcLabel(Name),
      new IFC.IfcLabel(Phase),
      [this.model.context],
      this.IfcUnitAssignment
    );

    const ifcSite = new IFC.IfcSite(
      new IFC.IfcGloballyUniqueId(uuidv4()),
      this.IfcOwnerHistory,
      new IFC.IfcLabel(""),
      new IFC.IfcLabel(""),
      new IFC.IfcLabel(""),
      IfcUtils.localPlacement(),
      null,
      new IFC.IfcLabel(""),
      IFC.IfcElementCompositionEnum.PARTIAL,
      null,
      null,
      null,
      new IFC.IfcLabel(""),
      this.IfcSiteAddress
    );
    const ifcBuilding = new IFC.IfcBuilding(
      new IFC.IfcGloballyUniqueId(uuidv4()),
      this.IfcOwnerHistory,
      new IFC.IfcLabel(""),
      new IFC.IfcLabel(""),
      new IFC.IfcLabel(""),
      IfcUtils.localPlacement(),
      null,
      new IFC.IfcLabel(""),
      IFC.IfcElementCompositionEnum.ELEMENT,
      new IFC.IfcLengthMeasure(0.0),
      new IFC.IfcLengthMeasure(0.0),
      this.IfcBuildingAddress
    );
    this.buildingStructure = new SpatialStructure(ifcBuilding);
    this.buildingStructure.Decomposed = this.RelAggregates(ifcBuilding, []);
    defaultLevels.forEach((level: ILevel) => {
      this.addLevel = level;
    });

    const siteStructure = new SpatialStructure(ifcSite);
    siteStructure.Decomposed = this.RelAggregates(ifcSite, []);
    siteStructure.child = this.buildingStructure;
    this.modelStructure = new SpatialStructure(ifcProject);
    this.modelStructure.Decomposed = this.RelAggregates(ifcProject, []);
    this.modelStructure.child = siteStructure;
  }
  RelAggregates(
    product: IFC.IfcObjectDefinition,
    children: IFC.IfcObjectDefinition[]
  ) {
    return new IFC.IfcRelAggregates(
      new IFC.IfcGloballyUniqueId(uuidv4()),
      this.IfcOwnerHistory,
      new IFC.IfcLabel(""),
      new IFC.IfcLabel(""),
      product,
      children
    );
  }
  RelContainedInSpatialStructure(spatial: IFC.IfcSpatialElement) {
    return new IFC.IfcRelContainedInSpatialStructure(
      new IFC.IfcGloballyUniqueId(uuidv4()),
      this.IfcOwnerHistory,
      new IFC.IfcLabel(""),
      new IFC.IfcLabel(""),
      [],
      spatial
    );
  }
  getIfcBuildingStorey(config: ILevel) {
    const {name, elevation, uuid} = config;
    const ifcBuildingStorey = new IFC.IfcBuildingStorey(
      new IFC.IfcGloballyUniqueId(uuid),
      this.IfcOwnerHistory,
      new IFC.IfcLabel(name),
      new IFC.IfcLabel(""),
      new IFC.IfcLabel(""),
      IfcUtils.localPlacement(),
      null,
      new IFC.IfcLabel(""),
      IFC.IfcElementCompositionEnum.ELEMENT,
      new IFC.IfcLengthMeasure(elevation)
    );
    return ifcBuildingStorey;
  }
}
