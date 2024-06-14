import {v4 as uuid4} from "uuid";
import {ILevel} from "@BimModel/src/LevelSystem/types";
import {BaseParameter, IParameterType} from "./BaseParameter";
import {IElement} from "clay";
import {IFC4X3 as IFC} from "web-ifc";
/**
 *
 */
export class TopLevelParameter extends BaseParameter {
  list!: string[] | number[] | BaseParameter[] | ILevel[];

  element!: IElement;
  uuid = uuid4();
  name = "Top Offset" as const;
  type: IParameterType = "InputNumber";
  value = 0;
  /**
   *
   */
  constructor(public level: ILevel) {
    super();
  }
  toIfc = () => {
    return new IFC.IfcPropertySingleValue(
      new IFC.IfcIdentifier(this.name),
      null,
      new IFC.IfcLengthMeasure(this.value),
      null
    );
  };
  onValueChange!: (
    value: string | number | boolean | ILevel | BaseParameter
  ) => void;
  onValueListChange!: (value: number) => void;
}
/**
 *
 */
export class BottomLevelParameter extends BaseParameter {
  list!: string[] | number[] | BaseParameter[] | ILevel[];

  element!: IElement;
  uuid = uuid4();
  name = "Bottom Offset" as const;
  type: IParameterType = "InputNumber";
  value = 0;
  /**
   *
   */
  constructor(public level: ILevel) {
    super();
  }
  toIfc = () => {
    return new IFC.IfcPropertySingleValue(
      new IFC.IfcIdentifier(this.name),
      null,
      new IFC.IfcLengthMeasure(this.value),
      null
    );
  };
  onValueChange!: (
    value: string | number | boolean | ILevel | BaseParameter
  ) => void;
  onValueListChange!: (value: number) => void;
}
