import {IBimElementType} from "@ProjectComponent/types";

import {
  IIfcBaseConfig,
  Model,
  SimpleBeamType,
  IElementType,
  RectangleProfile,
  ArbitraryClosedProfile,
  IShapeProfile,
} from "clay";

export class BeamTypeUtils {
  static getDefaultBeamTypes(
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
        return new SimpleBeamType(model, config.config, config.profile);
      }
    );

    return {
      types,
      selectType: types[0],
    };
  }
}
