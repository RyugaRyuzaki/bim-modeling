/**
 * @module BaseDraw
 */
import * as THREE from "three";
import {Components} from "@BimModel/src/Components";
import {MaterialComponent} from "@BimModel/src/MaterialComponent";
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";
export abstract class BaseDraw {
  abstract onClick: (e: MouseEvent) => void;
  abstract onMouseMove: (e: MouseEvent) => void;
  abstract onKeyDown: (e: KeyboardEvent) => void;
  abstract onMousedown: (e: MouseEvent) => void;
  abstract onFinished: () => void;
  abstract onCallBack: (value?: number) => void;
  abstract dispose: () => void;

  get LocationMaterial(): LineMaterial {
    return this.components.tools.get(MaterialComponent)
      ?.LocationMaterial as LineMaterial;
  }
  get container() {
    return this.components.container;
  }
  private _setupEvent = false;
  set setupEvent(enabled: boolean) {
    if (!this.container) return;
    if (!this._setupEvent === enabled) return;
    if (enabled) {
      this.container.addEventListener("click", this.onClick);
      this.container.addEventListener("mousemove", this.onMouseMove);
      this.container.addEventListener("mousedown", this.onMousedown);
    } else {
      this.container.removeEventListener("click", this.onClick);
      this.container.removeEventListener("mousemove", this.onMouseMove);
      this.container.removeEventListener("mousedown", this.onMousedown);
    }
  }
  get setupEvent() {
    return this._setupEvent;
  }
  /**
   *
   */
  constructor(private components: Components) {}
}
