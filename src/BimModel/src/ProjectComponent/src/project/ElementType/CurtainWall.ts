import {IBimElementType} from "@ProjectComponent/types";

import {
  IIfcBaseConfig,
  Model,
  SimpleCurtainWallType,
  SimpleMemberType,
  IElementType,
  SimplePlateType,
} from "clay";

const defaultCurtainWallTypes: IIfcBaseConfig[] = [
  {
    Name: "Basic Current Wall",
    Description: "Basic Frame 2x2",
    ObjectType: "Frame 2x2",
  },
];

export class CurtainWallTypeUtils {
  static getDefaultCurtainWallTypes(
    model: Model
  ): IBimElementType<IElementType> {
    const types = defaultCurtainWallTypes.map(
      (d) => new SimpleCurtainWallType(model, d)
    );
    return {
      types,
      selectType: types[0],
    };
  }
  static getDefaultMemberTypes(model: Model): IBimElementType<IElementType> {
    const types = [new SimpleMemberType(model)];
    return {
      types,
      selectType: types[0],
    };
  }
  static getDefaultPlateTypes(model: Model): IBimElementType<IElementType> {
    const types = [new SimplePlateType(model)];
    return {
      types,
      selectType: types[0],
    };
  }
}
