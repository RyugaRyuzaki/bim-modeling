import * as THREE from "three";
import {BaseDraw} from "./BaseDraw";
import {LocationLine} from "@BimModel/src/system";
import {IElement} from "clay";
import {BaseDrawCategory} from "./BaseDrawCategory";
export abstract class DrawRectangular extends BaseDraw<LocationLine, IElement> {
  abstract disposeElement: () => void;

  abstract addElement: () => void;

  abstract createElement: () => void;

  abstract updateElement: () => void;
  public locations: LocationLine[] = [];
  location!: LocationLine;
  /**
   *
   */
  constructor(public category: BaseDrawCategory) {
    const {components, workPlane} = category;
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
    for (const location of this.locations) {
      location.dispose();
    }
    this.locations = [];
  };
}
