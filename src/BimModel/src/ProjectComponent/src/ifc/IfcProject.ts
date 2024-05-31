/**
 *  @module ifc
 */
import * as THREE from "three";
import {Handle, IFC4X3 as IFC, IFCPROJECT} from "web-ifc";
import {IfcOwnerHistory} from "./IfcInfo";
import {IfcBase, IIfcBaseConfig} from "./IfcBase";
import {IfcUnitAssignment} from "./IfcUnit";

export interface IIfcProjectConfig extends IIfcBaseConfig {
  Phase: string;
}
const defaultProjectConfig: IIfcProjectConfig = {
  Name: "Bim-modeling",
  Description: "https://github.com/RyugaRyuzaki/bim-modeling",
  ObjectType: "Bim-modeling",
  LongName: "Web application Bim-modeling",
  Phase: "Concept modeling",
};
/**
 *https://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/IfcProject.htm
 */
export class IfcProject extends IfcBase implements IFC.IfcProject {
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
  Phase!: IFC.IfcLabel | null;
  type = IFCPROJECT;

  RepresentationContexts:
    | (IFC.IfcRepresentationContext | Handle<IFC.IfcRepresentationContext>)[]
    | null = [
    new IFC.IfcRepresentationContext(
      new IFC.IfcLabel("Model"),
      new IFC.IfcLabel("3D")
    ),
  ];
  UnitsInContext: IFC.IfcUnitAssignment | Handle<IFC.IfcUnitAssignment> | null =
    IfcUnitAssignment;
  IsDefinedBy!:
    | (IFC.IfcRelDefinesByProperties | Handle<IFC.IfcRelDefinesByProperties>)[]
    | null;
  Declares!: (IFC.IfcRelDeclares | Handle<IFC.IfcRelDeclares>)[] | null;
  HasAssignments!: (IFC.IfcRelAssigns | Handle<IFC.IfcRelAssigns>)[] | null;
  Nests!: (IFC.IfcRelNests | Handle<IFC.IfcRelNests>)[] | null;
  IsNestedBy!: (IFC.IfcRelNests | Handle<IFC.IfcRelNests>)[] | null;
  HasContext!: (IFC.IfcRelDeclares | Handle<IFC.IfcRelDeclares>)[] | null;
  IsDecomposedBy!:
    | (IFC.IfcRelAggregates | Handle<IFC.IfcRelAggregates>)[]
    | null;
  Decomposes: IFC.IfcRelAggregates[] | null = [
    this.createIfcRelAggregates(this),
  ];
  ContainsElements!:
    | (
        | IFC.IfcRelContainedInSpatialStructure
        | Handle<IFC.IfcRelContainedInSpatialStructure>
      )[]
    | null;

  HasAssociations!:
    | (IFC.IfcRelAssociates | Handle<IFC.IfcRelAssociates>)[]
    | null;
  expressID!: number;
  visible = true;
  /**
   *
   */
  constructor(config: IIfcProjectConfig = defaultProjectConfig) {
    super();
    const {Name, Description, LongName, ObjectType, Phase} = config;
    this.Name = new IFC.IfcLabel(Name);
    this.Description = new IFC.IfcLabel(Description);
    this.ObjectType = new IFC.IfcLabel(ObjectType);
    this.LongName = new IFC.IfcLabel(LongName);
    this.Phase = new IFC.IfcLabel(Phase);
  }
  onVisibility!: (visible: boolean, element: IfcBase) => void;
  onIsDecomposedBy?: ((Decomposed: IFC.IfcRelAggregates[]) => void) | undefined;
  onContainsElements?:
    | ((ContainsElements: IFC.IfcRelContainedInSpatialStructure[]) => void)
    | undefined;
  onHasAssociations?:
    | ((HasAssociations: IFC.IfcRelAssociates[]) => void)
    | undefined;
  onDecomposes = (Composed: IFC.IfcRelAggregates[]) => {
    if (!this.Decomposes) return;
    this.Decomposes = [...this.Decomposes, ...Composed];
  };
  onIfc = () => {
    return this;
  };
  static createInstance(
    onVisibility: (visible: boolean, element: IfcBase) => void
  ): IfcProject {
    const project = new IfcProject();
    project.onVisibility = onVisibility;
    return project;
  }
}
