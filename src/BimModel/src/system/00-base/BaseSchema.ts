import {IFC4, IFC2X3, IFC4X3, Schemas} from "web-ifc";

export abstract class BaseSchema {
  abstract schemaName: Schemas;
  get schema() {
    if (!this.schemaName) throw new Error("Need to define schema name");
    switch (this.schemaName) {
      case "IFC2X3":
        return IFC2X3;
      case "IFC4":
        return IFC4;
      case "IFC4X3":
        return IFC4X3;
      default:
        return IFC4;
    }
  }
}
