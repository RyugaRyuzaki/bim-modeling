import {IBaseElementType, IElementTypeEnum} from "./types";

export abstract class BaseElementType implements IBaseElementType {
  paramGeometry: any;
  abstract typeName: string;
  abstract typeEnum: IElementTypeEnum;
  abstract dispose: () => void;
}
