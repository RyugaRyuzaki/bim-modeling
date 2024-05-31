/**
 *  @module ifc
 */

import * as THREE from "three";
import {Handle, IFC4X3 as IFC} from "web-ifc";
import {IfcOwnerHistory} from "./IfcInfo";
import {IfcBase} from "./IfcBase";

/**
 *
 */
export class IfcElement extends IfcBase implements IFC.IfcElement {
  /** @attributes */
  GlobalId!: IFC.IfcGloballyUniqueId;
  OwnerHistory: IFC.IfcOwnerHistory | Handle<IFC.IfcOwnerHistory> | null =
    IfcOwnerHistory;
  Name!: IFC.IfcLabel | null;
  Description!: IFC.IfcText | null;
  ObjectType!: IFC.IfcLabel | null;
  type!: number;

  ObjectPlacement!:
    | IFC.IfcObjectPlacement
    | Handle<IFC.IfcObjectPlacement>
    | null;
  Representation!:
    | IFC.IfcProductRepresentation
    | Handle<IFC.IfcProductRepresentation>
    | null;
  Tag!: IFC.IfcIdentifier | null;
  FillsVoids!:
    | (IFC.IfcRelFillsElement | Handle<IFC.IfcRelFillsElement>)[]
    | null;
  ConnectedTo!:
    | (IFC.IfcRelConnectsElements | Handle<IFC.IfcRelConnectsElements>)[]
    | null;
  IsInterferedByElements!:
    | (IFC.IfcRelInterferesElements | Handle<IFC.IfcRelInterferesElements>)[]
    | null;
  InterferesElements!:
    | (IFC.IfcRelInterferesElements | Handle<IFC.IfcRelInterferesElements>)[]
    | null;
  HasProjections!:
    | (IFC.IfcRelProjectsElement | Handle<IFC.IfcRelProjectsElement>)[]
    | null;
  HasOpenings!:
    | (IFC.IfcRelVoidsElement | Handle<IFC.IfcRelVoidsElement>)[]
    | null;
  IsConnectionRealization!:
    | (
        | IFC.IfcRelConnectsWithRealizingElements
        | Handle<IFC.IfcRelConnectsWithRealizingElements>
      )[]
    | null;
  ProvidesBoundaries!:
    | (IFC.IfcRelSpaceBoundary | Handle<IFC.IfcRelSpaceBoundary>)[]
    | null;
  ConnectedFrom!:
    | (IFC.IfcRelConnectsElements | Handle<IFC.IfcRelConnectsElements>)[]
    | null;
  ContainedInStructure!:
    | (
        | IFC.IfcRelContainedInSpatialStructure
        | Handle<IFC.IfcRelContainedInSpatialStructure>
      )[]
    | null;
  HasCoverings!:
    | (IFC.IfcRelCoversBldgElements | Handle<IFC.IfcRelCoversBldgElements>)[]
    | null;
  HasSurfaceFeatures!:
    | (IFC.IfcRelAdheresToElement | Handle<IFC.IfcRelAdheresToElement>)[]
    | null;
  ReferencedBy!:
    | (IFC.IfcRelAssignsToProduct | Handle<IFC.IfcRelAssignsToProduct>)[]
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
  HasAssociations!:
    | (IFC.IfcRelAssociates | Handle<IFC.IfcRelAssociates>)[]
    | null;
  expressID!: number;
  ContainsElements!:
    | (
        | IFC.IfcRelContainedInSpatialStructure
        | Handle<IFC.IfcRelContainedInSpatialStructure>
      )[]
    | null;
  Decomposes!: (IFC.IfcRelAggregates | Handle<IFC.IfcRelAggregates>)[] | null;

  visible!: boolean;

  onVisibility!: (visible: boolean, element: IfcBase) => void;
  onIsDecomposedBy?: ((Decomposed: IFC.IfcRelAggregates[]) => void) | undefined;
  onDecomposes?: ((Composed: IFC.IfcRelAggregates[]) => void) | undefined;
  onContainsElements?:
    | ((ContainsElements: IFC.IfcRelContainedInSpatialStructure[]) => void)
    | undefined;
  onHasAssociations?:
    | ((HasAssociations: IFC.IfcRelAssociates[]) => void)
    | undefined;
  onIfc!: () =>
    | IFC.IfcElement
    | IFC.IfcBuildingStorey
    | IFC.IfcBuilding
    | IFC.IfcSite
    | IFC.IfcProject;
}
