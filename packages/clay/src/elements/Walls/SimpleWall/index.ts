import {v4 as uuidv4} from "uuid";
import {IFC4X3, IFC4X3 as IFC} from "web-ifc";
import {Model} from "../../../base";
import {DynamicElementType} from "../../Elements";
import {SimpleWall} from "./src";
import {IIfcBaseConfig} from "../../types";

export * from "./src";

export class SimpleWallType extends DynamicElementType<SimpleWall> {
  attributes: IFC4X3.IfcWallType;
  width = 0.2;

  constructor(model: Model, config: IIfcBaseConfig) {
    super(model);
    const {Name, Description, ObjectType} = config;

    this.attributes = new IFC.IfcWallType(
      new IFC.IfcGloballyUniqueId(uuidv4()),
      null,
      new IFC.IfcLabel(Name),
      new IFC.IfcLabel(Description),
      new IFC.IfcLabel(ObjectType),
      null,
      null,
      null,
      null,
      IFC.IfcWallTypeEnum.STANDARD
    );
  }

  protected createElement() {
    return new SimpleWall(this.model, this);
  }
}
