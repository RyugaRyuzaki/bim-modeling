/**
 * @module BaseModify
 */
import * as THREE from "three";
import {
  Components,
  RaycasterComponent,
  lengthUnitSignal,
  getLocalVectorOnFace,
  LocationPoint,
  LocationArc,
  LocationLine,
  ProjectComponent,
  modelStructureSignal,
  modelingSignal,
  SelectionComponent,
  Snapper,
  DrawTool,
} from "@BimModel/src";

export abstract class BaseModify {
  abstract onClick: (_e: MouseEvent) => void;
  abstract onMouseMove: (_e: MouseEvent) => void;
  abstract onMousedown: (_e: MouseEvent) => void;
  abstract onKeyDown: (_e: KeyboardEvent) => void;
  abstract onFinished: () => void;
  abstract dispose: () => void;
  get container() {
    return this.components.canvas;
  }
  get Snapper() {
    return this.components.tools.get(Snapper);
  }
  get RaycasterComponent() {
    return this.components.tools.get(RaycasterComponent);
  }

  get movingLine() {
    return this.components.tools.get(DrawTool)?.movingLine;
  }
  private _setupEvent = false;
  set setupEvent(enabled: boolean) {
    if (!this.container) return;
    if (this._setupEvent === enabled) return;
    this._setupEvent = enabled;
    if (enabled) {
      this.container.addEventListener("click", this.onClick);
      this.container.addEventListener("mousemove", this.onMouseMove);
      this.container.addEventListener("mousedown", this.onMousedown);
      this.container.addEventListener("mouseup", this.onMouseup);
      document.addEventListener("keydown", this.onKeyDown);
    } else {
      this.container.removeEventListener("click", this.onClick);
      this.container.removeEventListener("mousemove", this.onMouseMove);
      this.container.removeEventListener("mousedown", this.onMousedown);
      this.container.removeEventListener("mouseup", this.onMouseup);
      document.addEventListener("keydown", this.onKeyDown);
    }
  }
  get setupEvent() {
    return this._setupEvent;
  }

  private _inputKey = "";
  set inputKey(inputKey: string) {
    this._inputKey = inputKey;
    this.RaycasterComponent.delta.textContent = `${inputKey} ${lengthUnitSignal.value.symbol}`;
  }
  get inputKey() {
    return this._inputKey;
  }
  orthoDir: THREE.Vector3 | null = new THREE.Vector3();
  mousedown = false;
  constructor(public components: Components) {}
  private onMouseup = () => {
    this.mousedown = false;
  };
  getOrtho(
    start: THREE.Vector3,
    pMove: THREE.Vector3,
    workPlane: THREE.Plane
  ): THREE.Vector3 | null {
    const {x, z} = getLocalVectorOnFace(workPlane.normal);
    const dir = new THREE.Vector3(
      pMove.x - start.x,
      pMove.y - start.y,
      pMove.z - start.z
    ).normalize();
    let angle = dir.angleTo(x);
    const dis0 = start.distanceTo(pMove);

    if (
      (angle >= 0 && angle <= Math.PI / 4) ||
      (angle >= (3 * Math.PI) / 4 && angle <= Math.PI)
    ) {
      const dis = dis0 * Math.cos(angle);
      this.orthoDir = new THREE.Vector3(dis >= 0 ? 1 : -1, 0, 0);
      return start.clone().add(x.clone().multiplyScalar(dis));
    } else {
      angle = dir.angleTo(z);
      const dis = dis0 * Math.cos(angle);
      this.orthoDir = new THREE.Vector3(0, 0, dis >= 0 ? 1 : -1);
      return start.clone().add(z.clone().multiplyScalar(dis));
    }
  }
  getInputKey() {
    if (this.inputKey === "") return null;
    if (this.inputKey.startsWith("0")) return null;
    if (isNaN(parseFloat(this.inputKey))) return null;
    return parseFloat(this.inputKey);
  }
}
