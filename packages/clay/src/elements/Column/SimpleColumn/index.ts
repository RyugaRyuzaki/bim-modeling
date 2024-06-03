import {v4 as uuidv4} from "uuid";
import {IFC4X3, IFC4X3 as IFC} from "web-ifc";
import {Model} from "../../../base";
import {DynamicElementType} from "../../Elements";
import {IIfcBaseConfig} from "../../types";
import {SimpleColumn} from "./src";
import {Profile} from "../../../geometries";

export * from "./src";

export class SimpleColumnType extends DynamicElementType<SimpleColumn> {
  attributes: IFC4X3.IfcColumnType;
  width = 0.2;
  height = 0.4;

  constructor(model: Model, config: IIfcBaseConfig, public profile: Profile) {
    super(model);
    const {Name, Description, ObjectType} = config;

    this.attributes = new IFC.IfcColumnType(
      new IFC.IfcGloballyUniqueId(uuidv4()),
      this.model.IfcOwnerHistory,
      new IFC.IfcLabel(Name),
      new IFC.IfcLabel(Description),
      new IFC.IfcLabel(ObjectType),
      null,
      null,
      null,
      null,
      IFC.IfcColumnTypeEnum.COLUMN
    );
  }
  updateProfile() {
    const update = {
      width: this.width,
      height: this.height,
    };
    this.profile.updateProfile(update);
  }
  protected createElement() {
    return new SimpleColumn(this.model, this);
  }
}
