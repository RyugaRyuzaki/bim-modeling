import {v4 as uuid4} from "uuid";
import {ILevel} from "@BimModel/src/LevelSystem/types";
import {BaseParameter, IParameterType} from "./BaseParameter";
import {IElement} from "clay";
import {IFC4X3 as IFC} from "web-ifc";
/**
 *
 */
export class VolumeParameter extends BaseParameter {
  list!: string[] | number[] | BaseParameter[] | ILevel[];

  element!: IElement;
  uuid = uuid4();
  name!: string;
  type: IParameterType = "InputNumber";
  value = 0;
  /**
   *
   */
  constructor(name: string) {
    super();
    this.name = name;
  }
  toIfc = () => {
    return new IFC.IfcQuantityVolume(
      new IFC.IfcIdentifier(this.name || ""),
      null,
      null,
      new IFC.IfcLengthMeasure(this.value),
      null
    );
  };
  onValueChange!: (
    value: string | number | boolean | ILevel | BaseParameter
  ) => void;
  onValueListChange!: (value: number) => void;
  setValue = (value: number) => {
    this.value = value;
  };
}
