import {v4 as uuidv4} from "uuid";
import {IFC4X3, IFC4X3 as IFC} from "web-ifc";
import {Model} from "../../../base";
import {DynamicElementType} from "../../Elements";
import {SimpleSlab} from "./src";
import {IIfcBaseConfig} from "../../types";

export * from "./src";

export class SimpleSlabType extends DynamicElementType<SimpleSlab> {
  attributes: IFC4X3.IfcSlabType;

  constructor(model: Model, config: IIfcBaseConfig) {
    super(model);

    const {Name, Description, ObjectType} = config;

    this.attributes = new IFC.IfcSlabType(
      new IFC.IfcGloballyUniqueId(uuidv4()),
      null,
      new IFC.IfcLabel(Name),
      new IFC.IfcLabel(Description),
      new IFC.IfcLabel(ObjectType),
      null,
      null,
      null,
      null,
      IFC.IfcSlabTypeEnum.FLOOR
    );
  }

  protected createElement() {
    return new SimpleSlab(this.model, this);
  }
}
