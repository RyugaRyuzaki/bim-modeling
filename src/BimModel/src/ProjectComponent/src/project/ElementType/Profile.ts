import {Model, IRectangleConfig, RectangleProfile} from "clay";

export class ProfileUtils {
  static addRectangleProfile = (
    configProfile: IRectangleConfig,
    model: Model
  ) => {
    const profile = new RectangleProfile(model);
    profile.updateProfile(configProfile);
    return profile;
  };
}
