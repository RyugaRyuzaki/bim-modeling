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
export class PsetWallCommon extends BaseParameterGroup {
  uuid = uuid4();
  name = "PsetWallCommon" as const;
  HasProperties: {[uuid: string]: BaseParameter} = {};
  levelParameter!: LevelParameter;
  topLevelParameter!: TopLevelParameter;
  bottomLevelParameter!: BottomLevelParameter;
  /**
   *
   */
  constructor(element: IElement, level: ILevel) {
    super(element);
    this.levelParameter = new LevelParameter(element, level);
    this.levelParameter.onValueChange = this.onChangeLevel;
    this.topLevelParameter = new TopLevelParameter(element);
    this.bottomLevelParameter = new BottomLevelParameter(element);
    this.HasProperties[this.levelParameter.uuid] = this.levelParameter;
    this.HasProperties[this.topLevelParameter.uuid] = this.topLevelParameter;
    this.HasProperties[this.bottomLevelParameter.uuid] =
      this.bottomLevelParameter;
  }
  onChangeLevel = (
    _value: string | number | boolean | ILevel | BaseParameter
  ) => {
    // const {} = value as ILevel;
  };
  toIfc!: () => IFC.IfcPropertySet;
}
