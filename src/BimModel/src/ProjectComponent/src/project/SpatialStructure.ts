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
  // Decomposed!: IFC.IfcRelAggregates | IFC.IfcRelContainedInSpatialStructure;
  // get isDecomposed() {
  //   return this.Decomposed instanceof IFC.IfcRelAggregates;
  // }
  // get name() {
  //   return this.ifc.constructor.name;
  // }
  // get uuid() {
  //   return this.ifc.GlobalId?.value;
  // }
  // set child(child: SpatialStructure) {
  //   if (!this.Decomposed) return;
  //   if (this.children[child.uuid]) return;
  //   this.children[child.uuid] = child;
  //   const {ifc} = child;
  //   if (this.isDecomposed) {
  //     (
  //       (this.Decomposed as IFC.IfcRelAggregates)
  //         .RelatedObjects as IFC.IfcObjectDefinition[]
  //     ).push(ifc);
  //   } else {
  //     (
  //       (this.Decomposed as IFC.IfcRelContainedInSpatialStructure)
  //         .RelatedElements as IIfcProduct[]
  //     ).push(child.ifc);
  //   }
  // }
  // children: {[uuid: string]: SpatialStructure} = {};
  // visible = true;
  // onVisibility!: (visible: boolean, spatial: SpatialStructure) => void;
  // /**
  //  *
  //  */
  // constructor(public ifc: IIfcProduct) {}
  // static RelAggregates(
  //   product: IFC.IfcObjectDefinition,
  //   children: IFC.IfcObjectDefinition[]
  // ) {
  //   return new IFC.IfcRelAggregates(
  //     new IFC.IfcGloballyUniqueId(uuid4()),
  //     IfcOwnerHistory,
  //     new IFC.IfcLabel(""),
  //     new IFC.IfcLabel(""),
  //     product,
  //     children
  //   );
  // }
  // static RelContainedInSpatialStructure(spatial: IFC.IfcSpatialElement) {
  //   return new IFC.IfcRelContainedInSpatialStructure(
  //     new IFC.IfcGloballyUniqueId(uuid4()),
  //     IfcOwnerHistory,
  //     new IFC.IfcLabel(""),
  //     new IFC.IfcLabel(""),
  //     [],
  //     spatial
  //   );
  // }
  // static getIfcBuildingStorey(config: IIfcBuildingStoreyConfig) {
  //   const {Name, ObjectType, Description, Elevation} = config;
  //   const ifcBuildingStorey = new IFC.IfcBuildingStorey(
  //     new IFC.IfcGloballyUniqueId(uuid4()),
  //     IfcOwnerHistory,
  //     new IFC.IfcLabel(Name),
  //     new IFC.IfcLabel(Description),
  //     new IFC.IfcLabel(ObjectType),
  //     new IFC.IfcObjectPlacement(null),
  //     null,
  //     new IFC.IfcLabel(""),
  //     IFC.IfcElementCompositionEnum.ELEMENT,
  //     new IFC.IfcLengthMeasure(Elevation)
  //   );
  //   return ifcBuildingStorey;
  // }
}
