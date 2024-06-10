import * as WEBIFC from "web-ifc";
import {ClayObject} from "../../../base/clay-object";
import {IIfcBaseConfig} from "../../../elements";

export abstract class Profile extends ClayObject {
  abstract attributes: WEBIFC.IFC4X3.IfcProfileDef;
  abstract update: () => void;
  abstract updateProfile: (update: any) => void;
  abstract getInfo: () => IIfcBaseConfig;
}
