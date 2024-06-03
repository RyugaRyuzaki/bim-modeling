import {SimpleWall, IIfcBaseConfig} from "clay";
import {BaseElement} from "../BaseElement";
import {ILevel} from "@BimModel/src/LevelSystem/types";
import {Components} from "@BimModel/src";
import {createWallContainer} from "./Property";
import {BaseParameterGroup, PsetWallCommon} from "../Parameter";
import {IDrawType} from "@BimModel/src/ModelingComponent/types";

export class WallElement extends BaseElement {
  drawType!: IDrawType;
  container: HTMLDivElement = createWallContainer(this);
  groupParameter: {[uuid: string]: BaseParameterGroup} = {};
  element!: SimpleWall;
  private _level!: ILevel;
  set level(level: ILevel) {
    this.checkInit();
    this._level = {...level};
    this.element.startPoint.z = level.elevation;
    this.element.endPoint.z = level.elevation;
    this.element.update(true, true);
  }
  get level() {
    return this._level;
  }

  /**
   *
   */
  constructor(components: Components, config: IIfcBaseConfig, level: ILevel) {
    super(components, "SimpleWallType");
    this.element = this.selectType!.addInstance() as SimpleWall;
    this.config = config;
    this.level = level;
    const pset = new PsetWallCommon(this.element, level);
    this.groupParameter[pset.uuid] = pset;
  }
  dispose = () => {
    this.container?.remove();
  };
}
