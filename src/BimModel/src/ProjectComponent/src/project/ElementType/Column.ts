import {IBimElementType} from "@ProjectComponent/types";

import {
  IIfcBaseConfig,
  Model,
  SimpleColumnType,
  IElementType,
  IRectangleConfig,
} from "clay";
import {ProfileUtils} from "./Profile";

const defaultColumnTypes: {
  configType: IIfcBaseConfig;
  configProfile: IRectangleConfig;
}[] = [
  {
    configType: {
      Name: "R200x300",
      Description: "Concrete B20",
      ObjectType: "Concrete B20 R200x300",
    },
    configProfile: {
      width: 0.2,
      height: 0.3,
      offsetY: -0.15,
    },
  },
  {
    configType: {
      Name: "R200x400",
      Description: "Concrete B20",
      ObjectType: "Concrete B20 R200x400",
    },
    configProfile: {
      width: 0.5,
      height: 1.2,
      offsetY: -0.5,
    },
  },
];

export class ColumnTypeUtils {
  static getDefaultColumnTypes(model: Model): IBimElementType<IElementType> {
    const types = defaultColumnTypes.map((d) => {
      const {configType, configProfile} = d;
      return this.addRectangleType(configType, configProfile, model);
    });
    return {
      types,
      selectType: types[0],
    };
  }
  static addRectangleType = (
    configType: IIfcBaseConfig,
    configProfile: IRectangleConfig,
    model: Model
  ) => {
    const column = new SimpleColumnType(
      model,
      configType,
      ProfileUtils.addRectangleProfile(configProfile, model)
    );
    return column;
  };
}
