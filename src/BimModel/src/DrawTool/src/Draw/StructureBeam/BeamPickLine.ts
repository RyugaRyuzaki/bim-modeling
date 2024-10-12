/**
 * @module StructureBeam
 */
import {IElement, SimpleBeam} from "clay";
import {DrawPickLine} from "../DrawPickLine";
/**
 *
 */
export class BeamPickLine extends DrawPickLine {
  tempElement!: SimpleBeam;

  disposeElement = () => {};

  addElement = () => {};

  createElement = () => {};

  updateElement = () => {};
}
