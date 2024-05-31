/**
 *  @module ifc
 */
import * as THREE from "three";
import {Handle, IFC4X3 as IFC, IFCSITE} from "web-ifc";
import {IfcOwnerHistory, IfcSiteAddress} from "./IfcInfo";
import {IfcBase, IIfcBaseConfig} from "./IfcBase";

export interface IIfcSiteConfig extends IIfcBaseConfig {
  RefLatitude: number[];
  RefLongitude: number[];
  RefElevation: number;
}

/**
 *
 */
export class IfcSite extends IfcBase implements IFC.IfcSite {
  /** @attributes */
  GlobalId: IFC.IfcGloballyUniqueId = new IFC.IfcGloballyUniqueId(
    THREE.MathUtils.generateUUID()
  );
  OwnerHistory: IFC.IfcOwnerHistory | Handle<IFC.IfcOwnerHistory> | null =
    IfcOwnerHistory;
  Name!: IFC.IfcLabel | null;
  Description!: IFC.IfcText | null;
  ObjectType!: IFC.IfcLabel | null;
  LongName!: IFC.IfcLabel | null;
  type = IFCSITE;
  SiteAddress: IFC.IfcPostalAddress | Handle<IFC.IfcPostalAddress> | null =
    IfcSiteAddress;
  RefLatitude!: IFC.IfcCompoundPlaneAngleMeasure | null;
  RefLongitude!: IFC.IfcCompoundPlaneAngleMeasure | null;
  RefElevation!: IFC.IfcLengthMeasure | null;

  ObjectPlacement!:
    | IFC.IfcObjectPlacement
    | Handle<IFC.IfcObjectPlacement>
    | null;
  Representation!:
    | IFC.IfcProductRepresentation
    | Handle<IFC.IfcProductRepresentation>
    | null;
  CompositionType!: IFC.IfcElementCompositionEnum | null;
  LandTitleNumber!: IFC.IfcLabel | null;
  ContainsElements!:
    | (
        | IFC.IfcRelContainedInSpatialStructure
        | Handle<IFC.IfcRelContainedInSpatialStructure>
      )[]
    | null;
  ServicedBySystems!:
    | (IFC.IfcRelServicesBuildings | Handle<IFC.IfcRelServicesBuildings>)[]
    | null;
  ReferencesElements!:
    | (
        | IFC.IfcRelReferencedInSpatialStructure
        | Handle<IFC.IfcRelReferencedInSpatialStructure>
      )[]
    | null;
  ReferencedBy!:
    | (IFC.IfcRelAssignsToProduct | Handle<IFC.IfcRelAssignsToProduct>)[]
    | null;
  IsDeclaredBy!:
    | (IFC.IfcRelDefinesByObject | Handle<IFC.IfcRelDefinesByObject>)[]
    | null;
  Declares!:
    | (IFC.IfcRelDefinesByObject | Handle<IFC.IfcRelDefinesByObject>)[]
    | null;
  IsTypedBy!:
    | (IFC.IfcRelDefinesByType | Handle<IFC.IfcRelDefinesByType>)[]
    | null;
  IsDefinedBy!:
    | (IFC.IfcRelDefinesByProperties | Handle<IFC.IfcRelDefinesByProperties>)[]
    | null;
  HasAssignments!: (IFC.IfcRelAssigns | Handle<IFC.IfcRelAssigns>)[] | null;
  Nests!: (IFC.IfcRelNests | Handle<IFC.IfcRelNests>)[] | null;
  IsNestedBy!: (IFC.IfcRelNests | Handle<IFC.IfcRelNests>)[] | null;
  HasContext!: (IFC.IfcRelDeclares | Handle<IFC.IfcRelDeclares>)[] | null;
  IsDecomposedBy!:
    | (IFC.IfcRelAggregates | Handle<IFC.IfcRelAggregates>)[]
    | null;
  Decomposes: (IFC.IfcRelAggregates | Handle<IFC.IfcRelAggregates>)[] | null = [
    this.createIfcRelAggregates(this),
  ];
  HasAssociations!:
    | (IFC.IfcRelAssociates | Handle<IFC.IfcRelAssociates>)[]
    | null;
  IsInterferedByElements!:
    | (IFC.IfcRelInterferesElements | Handle<IFC.IfcRelInterferesElements>)[]
    | null;
  InterferesElements!:
    | (IFC.IfcRelInterferesElements | Handle<IFC.IfcRelInterferesElements>)[]
    | null;
  PositionedRelativeTo!:
    | (IFC.IfcRelPositions | Handle<IFC.IfcRelPositions>)[]
    | null;
  ReferencedInStructures!:
    | (
        | IFC.IfcRelReferencedInSpatialStructure
        | Handle<IFC.IfcRelReferencedInSpatialStructure>
      )[]
    | null;
  expressID!: number;
  visible = true;
  /**
   *
   */
  constructor(config: IIfcSiteConfig) {
    super();
    const {
      Name,
      ObjectType,
      Description,
      LongName,
      RefElevation,
      RefLatitude,
      RefLongitude,
    } = config;
    this.Name = new IFC.IfcLabel(Name);
    this.Description = new IFC.IfcLabel(Description);
    this.ObjectType = new IFC.IfcLabel(ObjectType);
    this.LongName = new IFC.IfcLabel(LongName);
    this.RefElevation = new IFC.IfcLengthMeasure(RefElevation);
    this.RefLatitude = new IFC.IfcCompoundPlaneAngleMeasure(RefLatitude);
    this.RefLongitude = new IFC.IfcCompoundPlaneAngleMeasure(RefLongitude);
  }

  onVisibility!: (visible: boolean, element: IfcBase) => void;
  onIsDecomposedBy?: ((Decomposed: IFC.IfcRelAggregates[]) => void) | undefined;
  onDecomposes?: ((Composed: IFC.IfcRelAggregates[]) => void) | undefined;
  onContainsElements?:
    | ((ContainsElements: IFC.IfcRelContainedInSpatialStructure[]) => void)
    | undefined;
  onHasAssociations?:
    | ((HasAssociations: IFC.IfcRelAssociates[]) => void)
    | undefined;
  onIfc = () => {
    return this;
  };
}
