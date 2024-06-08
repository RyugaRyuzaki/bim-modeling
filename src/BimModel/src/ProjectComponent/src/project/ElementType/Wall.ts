import {IBimElementType} from "@ProjectComponent/types";

import {
  IIfcBaseConfig,
  SimpleWallType,
  Model,
  IElementType,
  SimpleOpeningType,
} from "clay";

const defaultWallTypes: IIfcBaseConfig[] = [
  {
    Name: "Basic W100",
    Description: "Brick Wall",
    ObjectType: "W100",
  },
  {
    Name: "Basic W200",
    Description: "Brick Wall",
    ObjectType: "W200",
  },
  {
    Name: "Basic W300",
    Description: "Brick Wall",
    ObjectType: "W300",
  },
];
const defaultOpeningTypes: IIfcBaseConfig[] = [
  {
    Name: "",
    Description: "",
    ObjectType: "",
  },
];
export class WallTypeUtils {
  static getDefaultWallTypes(model: Model): IBimElementType<IElementType> {
    const types = defaultWallTypes.map((d, index) => {
      const wType = new SimpleWallType(model, d);
      wType.width = (index + 1) * 0.1;
      return wType;
    });
    return {
      types,
      selectType: types[0],
    };
  }
  static getDefaultOpeningTypes(model: Model): IBimElementType<IElementType> {
    const types = defaultOpeningTypes.map(
      (d) => new SimpleOpeningType(model, d)
    );
    return {
      types,
      selectType: types[0],
    };
  }
}
