/**
 *  @module ifc
 */
import {Model} from "clay";
import {SpatialStructure} from "./SpatialStructure";

/**
 *https://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/IfcProject.htm
 */
export class IfcProject {
  modelStructure!: SpatialStructure;
  ifcBuildingStoreys: SpatialStructure[] = [];

  /**
   *
   */
  constructor(private model: Model) {
    // this.initIfcProject();
  }

  // private initIfcProject() {
  //   const {Name, Description, ObjectType, Phase} = defaultProjectConfig;
  //   const ifcProject = new IFC.IfcProject(
  //     new IFC.IfcGloballyUniqueId(uuid4()),
  //     IfcOwnerHistory,
  //     new IFC.IfcLabel(Name),
  //     new IFC.IfcText(Description),
  //     new IFC.IfcLabel(ObjectType),
  //     new IFC.IfcLabel(Name),
  //     new IFC.IfcLabel(Phase),
  //     [this.model._context!],
  //     IfcUnitAssignment
  //   );

  //   const ifcSite = new IFC.IfcSite(
  //     new IFC.IfcGloballyUniqueId(uuid4()),
  //     IfcOwnerHistory,
  //     new IFC.IfcLabel(""),
  //     new IFC.IfcLabel(""),
  //     new IFC.IfcLabel(""),
  //     new IFC.IfcObjectPlacement(null),
  //     null,
  //     new IFC.IfcLabel(""),
  //     IFC.IfcElementCompositionEnum.PARTIAL,
  //     null,
  //     null,
  //     null,
  //     new IFC.IfcLabel(""),
  //     IfcSiteAddress
  //   );
  //   const ifcBuilding = new IFC.IfcBuilding(
  //     new IFC.IfcGloballyUniqueId(uuid4()),
  //     IfcOwnerHistory,
  //     new IFC.IfcLabel(""),
  //     new IFC.IfcLabel(""),
  //     new IFC.IfcLabel(""),
  //     new IFC.IfcObjectPlacement(null),
  //     null,
  //     new IFC.IfcLabel(""),
  //     IFC.IfcElementCompositionEnum.ELEMENT,
  //     new IFC.IfcLengthMeasure(0.0),
  //     new IFC.IfcLengthMeasure(0.0),
  //     IfcBuildingAddress
  //   );
  //   const buildingStructure = new SpatialStructure(ifcBuilding);
  //   buildingStructure.Decomposed = SpatialStructure.RelAggregates(
  //     ifcBuilding,
  //     []
  //   );
  //   defaultLevelConfig.forEach((d) => {
  //     const ifcBuildingStorey = SpatialStructure.getIfcBuildingStorey(d);
  //     const structureLevel = new SpatialStructure(ifcBuildingStorey);
  //     structureLevel.Decomposed =
  //       SpatialStructure.RelContainedInSpatialStructure(ifcBuildingStorey);
  //     buildingStructure.child = structureLevel;
  //     this.ifcBuildingStoreys.push(structureLevel);
  //   });

  //   const siteStructure = new SpatialStructure(ifcSite);
  //   siteStructure.Decomposed = SpatialStructure.RelAggregates(ifcSite, []);
  //   siteStructure.child = buildingStructure;
  //   this.modelStructure = new SpatialStructure(ifcProject);
  //   this.modelStructure.Decomposed = SpatialStructure.RelAggregates(
  //     ifcProject,
  //     []
  //   );
  //   this.modelStructure.child = siteStructure;
  // }
}
