import {Components} from "../Components";
import {GeometrySystem} from "./01-geometry";
import {ElementSystem} from "./02-element";
import {ElementTypeSystem} from "./03-element-type";
import {DrawToolSystem} from "./04-draw-tool";
import {ParameterSystem} from "./05-parameter";
import {CategorySystem} from "./06-category";
import {FamilySystem} from "./07-family";
import {LevelSystem} from "./08-level";
import {GridSystem} from "./09-grid";
import {ProjectSystem} from "./10-project";
import {SnapperSystem} from "./11-snapper";
import {WorkPlaneSystem} from "./12-work-plane";

export * from "./00-base";
export * from "./01-geometry";
export * from "./02-element";
export * from "./03-element-type";
export * from "./04-draw-tool";
export * from "./05-parameter";
export * from "./06-category";
export * from "./07-family";
export * from "./08-level";
export * from "./09-grid";
export * from "./10-project";
export * from "./11-snapper";
export * from "./12-work-plane";

export class SystemComponent {
  /**
   *
   */
  constructor(components: Components) {
    const geometry = components.tools.get(GeometrySystem);
    geometry.enabled = true;
    const elementSystem = components.tools.get(ElementSystem);
    elementSystem.enabled = true;
    const elementSystemType = components.tools.get(ElementTypeSystem);
    elementSystemType.enabled = true;
    const drawToolSystem = components.tools.get(DrawToolSystem);
    drawToolSystem.enabled = true;
    const parameterSystem = components.tools.get(ParameterSystem);
    parameterSystem.enabled = true;
    const categorySystem = components.tools.get(CategorySystem);
    categorySystem.enabled = true;
    const familySystem = components.tools.get(FamilySystem);
    familySystem.enabled = true;
    const levelSystem = components.tools.get(LevelSystem);
    levelSystem.enabled = true;
    const gridSystem = components.tools.get(GridSystem);
    gridSystem.enabled = true;
    const projectSystem = components.tools.get(ProjectSystem);
    projectSystem.enabled = true;
    const snapperSystem = components.tools.get(SnapperSystem);
    snapperSystem.enabled = true;
    const workPlaneSystem = components.tools.get(WorkPlaneSystem);
    workPlaneSystem.enabled = true;
  }
}
