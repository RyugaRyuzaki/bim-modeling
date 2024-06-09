import {v4 as uuid4} from "uuid";
import {BaseParameter} from "../BaseParameter";
import {BaseParameterGroup} from "../BaseParameterGroup";
import {IElement} from "clay";
import {LevelParameter} from "../LevelParameter";
import {IFC4X3 as IFC} from "web-ifc";
import {BottomLevelParameter, TopLevelParameter} from "../OffsetLevelParameter";
import {ILevel} from "@BimModel/src/LevelSystem/types";

/**
 *
 */
export class PsetWallLevelCommon extends BaseParameterGroup {
  element!: IElement;
  uuid = uuid4();
  name = "Wall Level Common" as const;
  HasProperties: {[uuid: string]: BaseParameter} = {};
  levelParameter!: LevelParameter;
  topLevelParameter!: TopLevelParameter;
  bottomLevelParameter!: BottomLevelParameter;
  /**
   *
   */
  constructor(level: ILevel) {
    super();
    this.levelParameter = new LevelParameter(level);
    this.levelParameter.onChangeLevel = this.onChangeLevel;
    this.topLevelParameter = new TopLevelParameter(level);
    this.topLevelParameter.onValueChange = this.onChangeTopLevel;
    this.bottomLevelParameter = new BottomLevelParameter(level);
    this.bottomLevelParameter.onValueChange = this.onChangeBottomLevel;
    this.HasProperties[this.levelParameter.uuid] = this.levelParameter;
    this.HasProperties[this.topLevelParameter.uuid] = this.topLevelParameter;
    this.HasProperties[this.bottomLevelParameter.uuid] =
      this.bottomLevelParameter;
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
    console.log(_value);
    if (!this.element) return;
    // const {} = value as ILevel;
  };
  onChangeBottomLevel = (
    _value: string | number | boolean | ILevel | BaseParameter
  ) => {
    console.log(_value);
    if (!this.element) return;
    // const {} = value as ILevel;
  };
  toIfc!: () => IFC.IfcPropertySet;
}
