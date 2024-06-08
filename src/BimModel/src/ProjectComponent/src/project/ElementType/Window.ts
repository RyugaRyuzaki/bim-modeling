import {IBimElementType} from "@ProjectComponent/types";

import {IIfcBaseConfig, Model, SimpleWindowType, IElementType} from "clay";

const defaultWindowTypes: IIfcBaseConfig[] = [
  {
    Name: "1000x200",
    Description: "Brick Window",
    ObjectType: "W100",
  },
];

export class WindowTypeUtils {
  static getDefaultWindowTypes(model: Model): IBimElementType<IElementType> {
    const types = defaultWindowTypes.map((d) => new SimpleWindowType(model, d));
    return {
      types,
      selectType: types[0],
    };
  }
}
