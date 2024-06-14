import {IFC4X3 as IFC} from "web-ifc";

export type IIfcProduct =
  | IFC.IfcProject
  | IFC.IfcSite
  | IFC.IfcBuilding
  | IFC.IfcBuilding
  | IFC.IfcBuildingStorey
  | IFC.IfcObjectDefinition
  | IFC.IfcElement
  | IFC.IfcProduct;
export type IDecomposed =
  | IFC.IfcRelAggregates
  | IFC.IfcRelContainedInSpatialStructure;

export class SpatialStructure {
  Decomposed!: IFC.IfcRelAggregates | IFC.IfcRelContainedInSpatialStructure;
  get isDecomposed() {
    return this.Decomposed instanceof IFC.IfcRelAggregates;
  }
  get name() {
    return this.ifc.constructor.name;
  }
  get uuid() {
    return this.ifc.GlobalId?.value;
  }
  set child(child: SpatialStructure) {
    if (!this.Decomposed) return;
    const uuid = child.uuid;
    if (!uuid) return;
    if (this.children.has(uuid)) return;
    this.children.set(uuid, child);
    if (this.isDecomposed) {
      (
        (this.Decomposed as IFC.IfcRelAggregates)
          .RelatedObjects as IFC.IfcObjectDefinition[]
      ).push(child.ifc);
    } else {
      (
        (this.Decomposed as IFC.IfcRelContainedInSpatialStructure)
          .RelatedElements as IIfcProduct[]
      ).push(child.ifc);
    }
  }
  children = new Map<string, SpatialStructure>();
  /**
   *
   */
  constructor(public ifc: IIfcProduct) {}
}
