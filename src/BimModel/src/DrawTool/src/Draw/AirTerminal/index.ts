/**
 * @module AirTerminal
 */
import * as THREE from "three";
import {BaseDrawCategory} from "../BaseDrawCategory";
import {Components} from "@BimModel/src/Components";
import {ICategory} from "@BimModel/src/system";
import {IDrawType} from "@ModelingComponent/types";

/**
 *
 */
export class AirTerminal extends BaseDrawCategory {
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