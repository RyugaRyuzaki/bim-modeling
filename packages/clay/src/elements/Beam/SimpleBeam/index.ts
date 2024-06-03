import {v4 as uuidv4} from "uuid";
import {IFC4X3, IFC4X3 as IFC} from "web-ifc";
import {Model} from "../../../base";
import {DynamicElementType} from "../../Elements";
import {SimpleBeam} from "./src";
import {IIfcBaseConfig} from "../../types";
import {Profile} from "../../../geometries";

export * from "./src";

export class SimpleBeamType extends DynamicElementType<SimpleBeam> {
  attributes: IFC4X3.IfcBeamType;
  width = 0.2;
  height = 0.4;
  constructor(model: Model, config: IIfcBaseConfig, public profile: Profile) {
    super(model);
    const {Name, Description, ObjectType} = config;
    this.attributes = new IFC.IfcBeamType(
      new IFC.IfcGloballyUniqueId(uuidv4()),
      this.model.IfcOwnerHistory,
      new IFC.IfcLabel(Name),
      new IFC.IfcLabel(Description),
      new IFC.IfcLabel(ObjectType),
      null,
      null,
      null,
      null,
      IFC.IfcBeamTypeEnum.BEAM
    );
  }
  updateProfile() {
    const update = {
      width: this.width,
      height: this.height,
      offsetY: -this.height / 2,
    };
    this.profile.updateProfile(update);
  }
  protected createElement() {
    return new SimpleBeam(this.model, this);
  }
}
