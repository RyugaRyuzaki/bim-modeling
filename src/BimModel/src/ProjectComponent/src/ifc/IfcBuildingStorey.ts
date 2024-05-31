/**
 *  @module ifc
 */
import * as THREE from "three";
import {Handle, IFC4X3 as IFC, IFCBUILDINGSTOREY} from "web-ifc";
import {IfcOwnerHistory} from "./IfcInfo";
import {IfcBase, IIfcBaseConfig} from "./IfcBase";
export interface IIfcBuildingStoreyConfig extends IIfcBaseConfig {
  Elevation: number;
  levelIndex: number;
}
export const defaultLevelConfig: IIfcBuildingStoreyConfig[] = [
  {
    Name: "Level 1",
    ObjectType: "Level Circle:Level 1",
    LongName: "Level Circle",
    Description: "",
    Elevation: 0.0,
    levelIndex: 0,
  },
  {
    Name: "Level 2",
    ObjectType: "Level Circle:Level 2",
    LongName: "Level Circle",
    Description: "",
    Elevation: 4.0,
    levelIndex: 1,
  },
];
/**
 *
 */
export class IfcBuildingStorey
  extends IfcBase
  implements IFC.IfcBuildingStorey
{
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
  Elevation!: IFC.IfcLengthMeasure | null;
  type = IFCBUILDINGSTOREY;

  ObjectPlacement!:
    | IFC.IfcObjectPlacement
    | Handle<IFC.IfcObjectPlacement>
    | null;
  Representation!:
    | IFC.IfcProductRepresentation
    | Handle<IFC.IfcProductRepresentation>
    | null;
  CompositionType!: IFC.IfcElementCompositionEnum | null;
  ContainsElements:
    | (
        | IFC.IfcRelContainedInSpatialStructure
        | Handle<IFC.IfcRelContainedInSpatialStructure>
      )[]
    | null = [this.createIfcRelContainedInSpatialStructure(this)];
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
  Decomposes!: (IFC.IfcRelAggregates | Handle<IFC.IfcRelAggregates>)[] | null;
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
  levelIndex!: number;
  set elevation(elevation: number) {
    if (!this.Elevation) return;
    this.Elevation.value = elevation;
  }
  /**
   *
   */
  constructor(config: IIfcBuildingStoreyConfig) {
    super();
    const {Name, ObjectType, Description, LongName, Elevation, levelIndex} =
      config;
    this.Name = new IFC.IfcLabel(Name);
    this.Description = new IFC.IfcLabel(Description);
    this.ObjectType = new IFC.IfcLabel(ObjectType);
    this.LongName = new IFC.IfcLabel(LongName);
    this.Elevation = new IFC.IfcLengthMeasure(Elevation);
    this.levelIndex = levelIndex;
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

  static createInstanceLevelItem(
    Name: string,
    ObjectType: string,
    Description: string,
    LongName: string,
    Elevation: number,
    levelIndex: number,
    onVisibility: (visible: boolean, element: IfcBase) => void
  ): IfcBuildingStorey {
    const level = new IfcBuildingStorey({
      Name,
      Description,
      LongName,
      ObjectType,
      Elevation,
      levelIndex,
    });
    level.onVisibility = onVisibility;
    return level;
  }
}
