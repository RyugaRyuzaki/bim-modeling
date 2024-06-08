import {IBimElementType} from "@ProjectComponent/types";

import {IIfcBaseConfig, Model, IElementType, SimpleSlabType} from "clay";

const defaultSimpleSlabTypes: IIfcBaseConfig[] = [
  {
    Name: "",
    Description: "",
    ObjectType: "",
  },
];

export class SlabTypeUtils {
  static getDefaultSlabTypes(model: Model): IBimElementType<IElementType> {
    const types = defaultSimpleSlabTypes.map(
      (d) => new SimpleSlabType(model, d)
    );
    return {
      types,
      selectType: types[0],
    };
  }
}
