import {IBimElementType} from "@ProjectComponent/types";

import {
  IIfcBaseConfig,
  IRectangleConfig,
  Model,
  SimpleBeamType,
  IElementType,
} from "clay";
import {ProfileUtils} from "./Profile";
const defaultBeamTypes: {
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
      height: 1.0,
      offsetY: -0.5,
    },
  },
];
export class BeamTypeUtils {
  static getDefaultBeamTypes(model: Model): IBimElementType<IElementType> {
    const types = defaultBeamTypes.map((d) => {
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
    const beamType = new SimpleBeamType(
      model,
      configType,
      ProfileUtils.addRectangleProfile(configProfile, model)
    );
    return beamType;
  };
}
