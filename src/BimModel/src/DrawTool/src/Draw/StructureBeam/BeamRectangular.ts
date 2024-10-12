/**
 * @module StructureBeam
 */
import {SimpleBeam} from "clay";
import {DrawRectangular} from "../DrawRectangular";
import {LocationLine} from "@BimModel/src/system";
/**
 *
 */
export class BeamRectangular extends DrawRectangular {
  tempElement!: SimpleBeam;

  disposeElement = () => {};

  addElement = () => {};

  createElement = () => {};

  updateElement = () => {};
}
