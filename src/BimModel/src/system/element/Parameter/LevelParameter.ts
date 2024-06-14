import {v4 as uuid4} from "uuid";
import {ILevel} from "@BimModel/src/LevelSystem/types";
import {BaseParameter, IParameterType} from "./BaseParameter";
import {IElement} from "clay";
import {IFC4X3 as IFC} from "web-ifc";
import {currentLevelSignal, listLevelSignal} from "@BimModel/src/Signals";
/**
 *
 */
export class LevelParameter extends BaseParameter {
  list: string[] | number[] | BaseParameter[] | ILevel[] =
    listLevelSignal.value;
  element!: IElement;
  uuid = uuid4();
  name = "Reference Level";
  type: IParameterType = "List";
  value!: ILevel;
  /**
   *
   */
  constructor(level: ILevel) {
    super();
    this.value = level;
  }
  toIfc = () => {
    return new IFC.IfcPropertySingleValue(
      new IFC.IfcIdentifier(this.name),
      null,
      new IFC.IfcLabel(this.value?.name),
      null
    );
  };

  onValueChange!: (
    value: string | number | boolean | ILevel | BaseParameter
  ) => void;
  onValueListChange = (
    value: string | number | boolean | ILevel | BaseParameter
  ) => {
    const level = listLevelSignal.value[+value];
    if (!level) return;
    this.value = level;
    if (!this.element) {
      currentLevelSignal.value = level;
    }
    if (this.onChangeLevel) this.onChangeLevel(level);
  };
  onChangeLevel!: (level: ILevel) => void;
}
