import {v4 as uuidv4} from "uuid";
import {IFC4X3 as IFC} from "web-ifc";
import {Model} from "../../../base";
import {DynamicElementType} from "../../Elements";
import {SimplePlate} from "./src";
import {IIfcBaseConfig} from "../../types";
export * from "./src";

const defaultConfig: IIfcBaseConfig = {
  Name: "",
  ObjectType: "",
  Description: "",
};

export class SimplePlateType extends DynamicElementType<SimplePlate> {
  attributes: IFC.IfcPlateType;

  plateType: IFC.IfcPlateTypeEnum;

  constructor(model: Model, config: IIfcBaseConfig = defaultConfig) {
    super(model);

    const {Name, Description, ObjectType} = config;

    this.plateType = IFC.IfcPlateTypeEnum.CURTAIN_PANEL;

    this.attributes = new IFC.IfcPlateType(
      new IFC.IfcGloballyUniqueId(uuidv4()),
      this.model.IfcOwnerHistory,
      new IFC.IfcLabel(Name),
      new IFC.IfcLabel(Description),
      new IFC.IfcLabel(ObjectType),
      null,
      null,
      null,
      null,
      this.plateType
    );
  }

  protected createElement() {
    return new SimplePlate(this.model, this);
  }
}
