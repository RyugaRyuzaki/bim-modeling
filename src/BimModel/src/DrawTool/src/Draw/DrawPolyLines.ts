import * as THREE from "three";

import {Components} from "@BimModel/src";
import {BaseDraw} from "./BaseDraw";
import {LocationLine} from "@BimModel/src/system";
import {IElement} from "clay";
export abstract class DrawPolyLines extends BaseDraw<LocationLine, IElement> {
  abstract disposeElement: () => void;

  abstract addElement: () => void;

  abstract createElement: () => void;

  abstract updateElement: () => void;
  /**
   *
   */
  constructor(components: Components, workPlane: THREE.Plane) {
    super(components, workPlane);
  }
  onClick = (_e: MouseEvent) => {};
  onMouseMove = (_e: MouseEvent) => {};
  onMousedown = (_e: MouseEvent) => {};
  onKeyDown = (_e: KeyboardEvent) => {};

  onFinished = () => {};
  onCallBack = (_value?: number) => {};
  dispose = () => {
    this.disposeElement!();
  };
}
