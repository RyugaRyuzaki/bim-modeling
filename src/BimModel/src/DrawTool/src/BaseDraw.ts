/**
 * @module BaseDraw
 */
import * as THREE from "three";
import {
  Components,
  RaycasterComponent,
  MaterialComponent,
  lengthUnitSignal,
  Dimension,
  DrawTool,
} from "@BimModel/src";
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";
import {getLocalVectorOnFace} from "@BimModel/src/utils";
import {ILevel} from "@BimModel/src/LevelSystem/types";
const upDirection = new THREE.Vector3(0, 1, 0);

export abstract class BaseDraw {
  abstract onClick: (_e: MouseEvent) => void;
  abstract onMouseMove: (_e: MouseEvent) => void;
  abstract onMousedown: (_e: MouseEvent) => void;
  abstract onKeyDown: (_e: KeyboardEvent) => void;
  abstract onFinished: () => void;
  abstract onCallBack: (_value?: number) => void;
  abstract dispose: () => void;

  get LocationMaterial(): LineMaterial {
    return this.components.tools.get(MaterialComponent)
      ?.LocationMaterial as LineMaterial;
  }
  get drawingDimension(): Dimension {
    return this.components.tools.get(DrawTool)?.drawingDimension;
  }
  get RaycasterComponent() {
    return this.components.tools.get(RaycasterComponent);
  }
  get container() {
    return this.components.container;
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
  public workPlane = new THREE.Plane(upDirection, 0);

  set workPlaneLevel(level: ILevel) {
    const {elevation} = level;
    this.workPlane.setFromNormalAndCoplanarPoint(
      upDirection,
      new THREE.Vector3(0, elevation, 0)
    );
  }
  private _foundPoint: THREE.Vector3 | null = null;
  set findPoint(event: MouseEvent | null) {
    if (!event) {
      this._foundPoint = null;
      return;
    }
    const raycast = this.components.tools.get(RaycasterComponent);
    raycast.mouseMove = event;
    this._foundPoint = raycast.getPointRayCasPlane(this.workPlane);
  }
  get foundPoint() {
    return this._foundPoint;
  }

  orthoDir: THREE.Vector3 | null = new THREE.Vector3();
  private _inputKey = "";
  set inputKey(inputKey: string) {
    this._inputKey = inputKey;
    this.RaycasterComponent.delta.textContent = `${inputKey} ${lengthUnitSignal.value.symbol}`;
  }
  get inputKey() {
    return this._inputKey;
  }
  mousedown = false;
  /**
   *
   */
  constructor(public components: Components) {}
  private onMouseup = () => {
    this.mousedown = false;
  };
  getOrtho(start: THREE.Vector3, pMove: THREE.Vector3): THREE.Vector3 | null {
    const {x, z} = getLocalVectorOnFace(this.workPlane.normal);
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
      23;
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
  getDistance(start: THREE.Vector3, end: THREE.Vector3, distance: number) {
    const dir = new THREE.Vector3(
      end.x - start.x,
      end.y - start.y,
      end.z - start.z
    ).normalize();
    return start.clone().add(dir.multiplyScalar(distance));
  }
}
