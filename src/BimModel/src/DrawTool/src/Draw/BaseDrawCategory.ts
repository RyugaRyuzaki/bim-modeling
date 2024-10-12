/**
 * @module BaseDrawCategory
 */
import * as THREE from "three";
import {
  BaseLocation,
  Components,
  ElementLocation,
  ICategory,
  RaycasterComponent,
  tempElementSignal,
} from "@BimModel/src";
import {Disposable} from "@BimModel/src/types";
import {BaseDraw} from "./BaseDraw";
import {IDrawType} from "@BimModel/src/ModelingComponent/types";
import {IElement} from "clay";
export abstract class BaseDrawCategory implements Disposable {
  abstract setDrawing: (drawType: IDrawType) => void;
  /** @draws  */
  public draws: {[name: string]: BaseDraw<BaseLocation, IElement>} = {};
  public optionElement: {[option: string]: ElementLocation} = {};

  get RaycasterComponent() {
    return this.components.tools.get(RaycasterComponent);
  }

  private _active = false;

  set activeCategory(category: ICategory | null) {
    if (!category) {
      this._active = false;
    } else {
      this._active = category === this.category;
    }
    if (!this._active) this.disposeDraws();
  }

  get active() {
    return this._active;
  }
  set drawing(drawType: IDrawType) {
    if (!this.active) return;
    for (const name in this.draws) {
      const draw = this.draws[name];
      draw.setupEvent = drawType === name;
    }
    if (this.setDrawing) this.setDrawing(drawType);
  }

  /**
   *
   */
  constructor(
    public components: Components,
    public workPlane: THREE.Plane,
    public readonly category: ICategory
  ) {}
  async dispose() {
    this.disposeDraws();
    this.draws = {};
    this.disposeOption();
    this.optionElement = {};
  }
  private disposeDraws() {
    for (const name in this.draws) {
      const draw = this.draws[name];
      draw.setupEvent = false;
      draw.dispose();
    }
    tempElementSignal.value = null;
  }
  private disposeOption() {
    for (const name in this.optionElement) {
      this.optionElement[name].dispose();
    }
  }
}
