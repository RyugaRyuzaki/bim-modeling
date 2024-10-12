/**
 * @module StructureSlab
 */
import * as THREE from "three";
import {BaseDrawCategory} from "../BaseDrawCategory";
import {Components} from "@BimModel/src/Components";
import {ElementLocation, ICategory} from "@BimModel/src/system";
import {IDrawType} from "@ModelingComponent/types";

/**
 *
 */
export class StructureSlab extends BaseDrawCategory {
  /**
   *
   */
  constructor(
    components: Components,
    workPlane: THREE.Plane,
    category: ICategory
  ) {
    super(components, workPlane, category);
  }
  setDrawing = (_drawType: IDrawType) => {};
}
