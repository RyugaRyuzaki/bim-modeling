import {v4 as uuid4} from "uuid";
import {ILevel} from "@BimModel/src/LevelSystem/types";
import {BaseParameter, IParameterType} from "./BaseParameter";
import {IElement} from "clay";
import {IFC4X3 as IFC} from "web-ifc";
/**
 *
 */
export class TopLevelParameter extends BaseParameter {
  list!: any[] | ILevel[];
  uuid = uuid4();
  name = "Top Offset" as const;
  type: IParameterType = "InputNumber";
  value = 0;
  /**
   *
   */
  constructor(element: IElement) {
    super(element);
  }
  toIfc!: () => IFC.IfcPropertySingleValue | IFC.IfcPropertyReferenceValue;
  onValueChange!: (
    value: string | number | boolean | ILevel | BaseParameter
  ) => void;
}
/**
 *
 */
export class BottomLevelParameter extends BaseParameter {
  list!: any[] | ILevel[];
  uuid = uuid4();
  name = "Bottom Offset" as const;
  type: IParameterType = "InputNumber";
  value = 0;
  /**
   *
   */
  constructor(element: IElement) {
    super(element);
  }
  toIfc!: () => IFC.IfcPropertySingleValue | IFC.IfcPropertyReferenceValue;
  onValueChange!: (
    value: string | number | boolean | ILevel | BaseParameter
  ) => void;
}
