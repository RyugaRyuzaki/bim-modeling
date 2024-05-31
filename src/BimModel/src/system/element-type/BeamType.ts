import * as THREE from "three";
import {Handle, IFC4, IFCBEAMTYPE} from "web-ifc";
import {IElementTypeEnum} from "./types";
import {BaseElementType} from "./BaseElementType";
import {IfcElements} from "../base";

export class BeamType extends BaseElementType implements IFC4.IfcBeamType {
  GlobalId: IFC4.IfcGloballyUniqueId = new IFC4.IfcGloballyUniqueId(
    THREE.MathUtils.generateUUID()
  );
  OwnerHistory!: IFC4.IfcOwnerHistory | Handle<IFC4.IfcOwnerHistory> | null;
  Name!: IFC4.IfcLabel | null;
  Description!: IFC4.IfcText | null;
  ApplicableOccurrence!: IFC4.IfcIdentifier | null;
  HasPropertySets!:
    | (IFC4.IfcPropertySetDefinition | Handle<IFC4.IfcPropertySetDefinition>)[]
    | null;
  RepresentationMaps!:
    | (IFC4.IfcRepresentationMap | Handle<IFC4.IfcRepresentationMap>)[]
    | null;
  Tag!: IFC4.IfcLabel | null;
  ElementType!: IFC4.IfcLabel | null;
  PredefinedType!: IFC4.IfcBeamTypeEnum;
  type = IFCBEAMTYPE;
  ReferencedBy!:
    | (IFC4.IfcRelAssignsToProduct | Handle<IFC4.IfcRelAssignsToProduct>)[]
    | null;
  Types!:
    | (IFC4.IfcRelDefinesByType | Handle<IFC4.IfcRelDefinesByType>)[]
    | null;
  HasAssignments!: (IFC4.IfcRelAssigns | Handle<IFC4.IfcRelAssigns>)[] | null;
  Nests!: (IFC4.IfcRelNests | Handle<IFC4.IfcRelNests>)[] | null;
  IsNestedBy!: (IFC4.IfcRelNests | Handle<IFC4.IfcRelNests>)[] | null;
  HasContext!: (IFC4.IfcRelDeclares | Handle<IFC4.IfcRelDeclares>)[] | null;
  IsDecomposedBy!:
    | (IFC4.IfcRelAggregates | Handle<IFC4.IfcRelAggregates>)[]
    | null;
  Decomposes!: (IFC4.IfcRelAggregates | Handle<IFC4.IfcRelAggregates>)[] | null;
  HasAssociations!:
    | (IFC4.IfcRelAssociates | Handle<IFC4.IfcRelAssociates>)[]
    | null;
  expressID!: number;
  typeName = IfcElements[IFCBEAMTYPE];
  typeEnum: IElementTypeEnum = "BeamType";
  /**
   *
   */
  constructor(name: string) {
    super();
    this.Name = new IFC4.IfcLabel(name);
  }

  dispose = () => {};
}