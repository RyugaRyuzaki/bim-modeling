import {IFC4} from "web-ifc";
import {v4 as uuid4} from "uuid";
export function globalId(): IFC4.IfcGloballyUniqueId {
  return new IFC4.IfcGloballyUniqueId(uuid4());
}
