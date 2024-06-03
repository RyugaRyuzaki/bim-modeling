import {v4 as uuid4} from "uuid";
import {ILevel} from "@BimModel/src/LevelSystem/types";
import {BaseParameter, IParameterType} from "./BaseParameter";
import {IElement} from "clay";
import {IFC4X3 as IFC} from "web-ifc";
import {listLevelSignal} from "@BimModel/src/Signals";
/**
 *
 */
export class LevelParameter extends BaseParameter {
  list: any[] | ILevel[] = listLevelSignal.value;
  uuid = uuid4();
  name = "Reference Level";
  type: IParameterType = "List";
  value!: ILevel;
  /**
   *
   */
  constructor(element: IElement, level: ILevel) {
    super(element);
    this.value = level;
  }
  toIfc!: () => IFC.IfcPropertySingleValue | IFC.IfcPropertyReferenceValue;
  onValueChange!: (
    value: string | number | boolean | ILevel | BaseParameter
  ) => void;
}
