import {IBimElementType} from "@ProjectComponent/types";

import {
  IIfcBaseConfig,
  Model,
  SimpleColumnType,
  IElementType,
  RectangleProfile,
  ArbitraryClosedProfile,
  IShapeProfile,
} from "clay";

export class ColumnTypeUtils {
  static getDefaultColumnTypes(
    model: Model,
    configs: {
      config: IIfcBaseConfig;
      profile: RectangleProfile | ArbitraryClosedProfile | IShapeProfile;
    }[]
  ): IBimElementType<IElementType> {
    const types = configs.map(
      (config: {
        config: IIfcBaseConfig;
        profile: RectangleProfile | ArbitraryClosedProfile | IShapeProfile;
      }) => {
        return new SimpleColumnType(model, config.config, config.profile);
      }
    );
    return {
      types,
      selectType: types[0],
    };
  }
}
