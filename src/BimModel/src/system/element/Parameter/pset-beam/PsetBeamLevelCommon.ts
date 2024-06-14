import {BaseParameter} from "../BaseParameter";
import {BaseParameterGroup} from "../BaseParameterGroup";
import {IElement} from "clay";
import {LevelParameter} from "../LevelParameter";
import {TopLevelParameter} from "../OffsetLevelParameter";
import {ILevel} from "@BimModel/src/LevelSystem/types";

/**
 *
 */
export class PsetBeamLevelCommon extends BaseParameterGroup {
  element!: IElement;
  name = "Beam Level Common" as const;
  HasProperties: {[uuid: string]: BaseParameter} = {};
  levelParameter!: LevelParameter;
  offsetLevelParameter!: TopLevelParameter;
  /**
   *
   */
  constructor(level: ILevel) {
    super();
    this.levelParameter = new LevelParameter(level);
    this.levelParameter.onChangeLevel = this.onChangeLevel;
    this.offsetLevelParameter = new TopLevelParameter(level);
    this.offsetLevelParameter.onValueChange = this.onChangeTopLevel;
    this.HasProperties[this.levelParameter.uuid] = this.levelParameter;
    this.HasProperties[this.offsetLevelParameter.uuid] =
      this.offsetLevelParameter;
  }
  updateElement = (element: IElement) => {
    this.element = element;
  };
  onChangeLevel = (_value: ILevel) => {
    // const {} = value as ILevel;
  };
  onChangeTopLevel = (
    _value: string | number | boolean | ILevel | BaseParameter
  ) => {
    if (!this.element) return;
    // const {} = value as ILevel;
  };
}
