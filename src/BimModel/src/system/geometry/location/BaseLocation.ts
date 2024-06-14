/**
 * @module GeometrySystem
 */
import * as THREE from "three";

import {Components, MaterialComponent} from "@BimModel/src";

export abstract class BaseLocation {
  private _select = false;
  set select(select: boolean) {
    if (!this._select === select) return;
    this._select = select;
    if (this.onSelect) this.onSelect(select);
  }
  set hover(hover: boolean) {
    if (this._select) return;
    if (this.onHover) this.onHover(hover);
  }
  private _visible = false;
  set visible(visible: boolean) {
    if (this._visible === visible) return;
    this._visible = visible;
    if (this.onVisibility) this.onVisibility(visible);
  }
  get visible() {
    return this._visible;
  }
  abstract onSelect: (select: boolean) => void;
  abstract onHover: (hover: boolean) => void;
  abstract onVisibility: (visible: boolean) => void;
  abstract onClone: () => BaseLocation;
  get LocationMaterial() {
    return this.components.tools.get(MaterialComponent)?.LocationMaterial;
  }
  get DimensionMaterial() {
    return this.components.tools.get(MaterialComponent)?.DimensionMaterial;
  }
  get AngleMaterial() {
    return this.components.tools.get(MaterialComponent)?.AngleMaterial;
  }
  /**
   *
   */
  constructor(public components: Components, public workPlane: THREE.Plane) {}
}
