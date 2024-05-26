import {IFC4} from "web-ifc";
import * as THREE from "three";
export function globalId(): IFC4.IfcGloballyUniqueId {
  return new IFC4.IfcGloballyUniqueId(THREE.MathUtils.generateUUID());
}
