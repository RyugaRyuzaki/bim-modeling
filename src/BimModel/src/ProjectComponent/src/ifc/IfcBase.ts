import * as THREE from "three";
import {Handle, IFC4X3 as IFC} from "web-ifc";
import {IfcOwnerHistory} from "./IfcInfo";
export interface IIfcBaseConfig {
  Name: string;
  Description: string;
  ObjectType: string;
  LongName: string;
}
export abstract class IfcBase {
  abstract ContainsElements:
    | (
        | IFC.IfcRelContainedInSpatialStructure
        | Handle<IFC.IfcRelContainedInSpatialStructure>
      )[]
    | null;
  abstract Decomposes:
    | (IFC.IfcRelAggregates | Handle<IFC.IfcRelAggregates>)[]
    | null;
  abstract GlobalId: IFC.IfcGloballyUniqueId;
  abstract Name: IFC.IfcLabel | null;
  abstract visible: boolean;
  abstract onVisibility: (visible: boolean, element: IfcBase) => void;
  abstract onIsDecomposedBy?: (Decomposed: IFC.IfcRelAggregates[]) => void;
  abstract onDecomposes?: (Composed: IFC.IfcRelAggregates[]) => void;
  abstract onContainsElements?: (
    ContainsElements: IFC.IfcRelContainedInSpatialStructure[]
  ) => void;
  abstract onHasAssociations?: (
    HasAssociations: IFC.IfcRelAssociates[]
  ) => void;
  abstract onIfc: () =>
    | IFC.IfcBuildingStorey
    | IFC.IfcBuilding
    | IFC.IfcSite
    | IFC.IfcProject
    | IFC.IfcElement;
  get uuid() {
    return this.GlobalId?.value;
  }
  get name() {
    if (!this.Name) throw new Error();
    return this.Name?.value;
  }
  get hasChildren() {
    if (!this.ContainsElements && !this.Decomposes) return false;
    return this.ContainsElements!.length > 0 || this.Decomposes!.length > 0;
  }
  get children(): IfcBase[] {
    if (!this.ContainsElements && !this.Decomposes) return [];
    if (this.ContainsElements) {
      return this.ContainsElements.reduce((re: IfcBase[], e) => {
        return [
          ...re,
          ...((e as IFC.IfcRelContainedInSpatialStructure)
            .RelatedElements as any[]),
        ];
      }, []);
    } else if (this.Decomposes) {
      return this.Decomposes.reduce((re: IfcBase[], e) => {
        return [
          ...re,
          ...((e as IFC.IfcRelAggregates).RelatedObjects as any[]),
        ];
      }, []);
    } else return [];
  }
  createIfcRelContainedInSpatialStructure(element: IFC.IfcSpatialElement) {
    return new IFC.IfcRelContainedInSpatialStructure(
      new IFC.IfcGloballyUniqueId(THREE.MathUtils.generateUUID()),
      IfcOwnerHistory,
      new IFC.IfcLabel(""),
      new IFC.IfcLabel(""),
      [],
      element
    );
  }
  createIfcRelAggregates(
    element: IFC.IfcSpatialElement | IFC.IfcObjectDefinition
  ) {
    return new IFC.IfcRelAggregates(
      new IFC.IfcGloballyUniqueId(THREE.MathUtils.generateUUID()),
      IfcOwnerHistory,
      new IFC.IfcLabel(""),
      new IFC.IfcLabel(""),
      element,
      []
    );
  }
}
