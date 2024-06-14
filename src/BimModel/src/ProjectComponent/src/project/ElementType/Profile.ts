import * as THREE from "three";

import {
  Model,
  IRectangleConfig,
  RectangleProfile,
  ArbitraryClosedProfile,
  IIShapeConfig,
  IIfcBaseConfig,
  IShapeProfile,
} from "clay";
import {lengthUnitSignal} from "@BimModel/src/Signals";

const defaultRectangleTypes: IRectangleConfig[] = [
  {
    width: 0.2,
    height: 0.3,
  },
  {
    width: 0.2,
    height: 0.4,
  },
  {
    width: 0.5,
    height: 1.0,
  },
];
const defaultIShapeTypes: IIShapeConfig[] = [
  {
    bf: 0.15,
    hf: 0.008,
    bw: 0.006,
    hw: 0.3,
  },
  {
    bf: 0.2,
    hf: 0.008,
    bw: 0.006,
    hw: 0.4,
  },
  {
    bf: 0.3,
    hf: 0.01,
    bw: 0.012,
    hw: 0.6,
  },
];

export class ProfileUtils {
  static addRectangleProfile = (
    configProfile: IRectangleConfig,
    model: Model
  ) => {
    const profile = new RectangleProfile(model);
    profile.updateProfile(configProfile);
    return profile;
  };
  static addRectangleConfig = (
    configProfile: IRectangleConfig,
    mat = "Concrete"
  ) => {
    const {width, height} = configProfile;
    const {factor} = lengthUnitSignal.value;
    return {
      Name: `R${width * factor}x${height * factor}`,
      Description: mat,
      ObjectType: `${mat} ${width * factor}x${height * factor}`,
    };
  };
  static addIShapeProfile = (configProfile: IIShapeConfig, model: Model) => {
    return new IShapeProfile(model, configProfile);
  };
  static addIShapeConfig = (configProfile: IIShapeConfig) => {
    const {bf, bw, hw} = configProfile;
    const {factor} = lengthUnitSignal.value;
    return {
      Name: `I${hw * factor}x${bf * factor}`,
      Description: `SS400 I${hw * factor}x${bf * factor}`,
      ObjectType: `I${hw * factor}x${bf * factor}x${bw * factor}x${
        hw * factor
      }`,
    };
  };

  static createRectangleProfiles(model: Model): RectangleProfile[] {
    return defaultRectangleTypes.map((d) => this.addRectangleProfile(d, model));
  }
  static createIShapeProfiles(model: Model): IShapeProfile[] {
    return defaultIShapeTypes.map((d) => this.addIShapeProfile(d, model));
  }
  static createProfiles(model: Model): {
    config: IIfcBaseConfig;
    profile: RectangleProfile | ArbitraryClosedProfile | IShapeProfile;
  }[] {
    const {factor} = lengthUnitSignal.value;

    return [
      ...defaultRectangleTypes.map((d) => {
        const {width, height} = d;
        return {
          config: {
            Name: `R${width * factor}x${height * factor}`,
            Description: "Concrete B20",
            ObjectType: `Concrete ${width * factor}x${height * factor}`,
          },
          profile: this.addRectangleProfile(d, model),
        };
      }),
      ...defaultIShapeTypes.map((d) => {
        const {bf, bw, hw} = d;
        return {
          config: {
            Name: `I${hw * factor}x${bf * factor}`,
            Description: `SS400 I${hw * factor}x${bf * factor}`,
            ObjectType: `I${hw * factor}x${bf * factor}x${bw * factor}x${
              hw * factor
            }`,
          },
          profile: this.addIShapeProfile(d, model),
        };
      }),
    ];
  }
}
