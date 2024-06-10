import {IBimElementType} from "@ProjectComponent/types";

import {
  IIfcBaseConfig,
  Model,
  SimpleBeamType,
  IElementType,
  RectangleProfile,
  ArbitraryClosedProfile,
} from "clay";

export class BeamTypeUtils {
  static getDefaultBeamTypes(
    model: Model,
    configs: {
      config: IIfcBaseConfig;
      profile: RectangleProfile | ArbitraryClosedProfile;
    }[]
  ): IBimElementType<IElementType> {
    const types = configs.map(
      (config: {
        config: IIfcBaseConfig;
        profile: RectangleProfile | ArbitraryClosedProfile;
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
