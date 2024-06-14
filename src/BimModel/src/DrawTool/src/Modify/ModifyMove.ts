import * as THREE from "three";

import {BaseModify} from "./BaseModify";
import {
  Components,
  getDirection,
  isOrthoSignal,
  lengthUnitSignal,
  modifySignal,
  selectElementSignal,
} from "@BimModel/src";
/**
 *
 */
export class ModifyMove extends BaseModify {
  private movingPoint: THREE.Vector3 | null = null;
  private origin: THREE.Vector3 | null = null;
  /**
   *
   * @param components
   */
  constructor(components: Components) {
    super(components);
  }
  onClick = (_e: MouseEvent) => {
    if (!selectElementSignal.value || this.mousedown) return;
    if (!this.origin || !this.movingPoint) return;
    this.onFinished();
  };
  onMouseMove = (_e: MouseEvent) => {
    if (!selectElementSignal.value || this.mousedown) return;
    const {location} = selectElementSignal.value;
    if (!location || !location.workPlane) return;
    if (!this.origin) {
      const pos = selectElementSignal.value.element.position;
      this.origin = new THREE.Vector3(pos.x, pos.z, -pos.y);
    }
    this.RaycasterComponent.mouseMove = _e;
    this.Snapper.find = _e;
    this.movingPoint = this.RaycasterComponent.getPointRayCasPlane(
      location.workPlane
    );
    if (!this.movingPoint) return;
    if (this.origin) {
      if (isOrthoSignal.value) {
        this.movingPoint = this.getOrtho(
          this.origin,
          this.movingPoint.clone(),
          location.workPlane
        ) as THREE.Vector3;
      } else {
        this.orthoDir = null;
      }
    }
    if (this.Snapper.snap) this.movingPoint = this.Snapper.snap.clone();
    this.movingLine.update(this.origin, this.movingPoint);
    this.movingLine.visible = true;
  };
  onMousedown = (_e: MouseEvent) => {
    if (_e.button === 0) this.mousedown = true;
  };
  onKeyDown = (_e: KeyboardEvent) => {
    if (_e.key === "Enter") {
      if (!this.origin || !this.movingPoint) {
        this.inputKey = "";
        return;
      }
      const distance = this.getInputKey();
      if (!distance) {
        this.inputKey = "";
        return;
      }
      const {factor} = lengthUnitSignal.value;
      const dir = getDirection(this.origin, this.movingPoint);
      this.movingPoint = this.origin
        .clone()
        .add(dir.clone().multiplyScalar(distance / factor));
      this.movingLine.update(this.origin, this.movingPoint);
      this.onFinished();
    }
    if (_e.key >= "0" && _e.key <= "9") {
      this.inputKey += _e.key;
    }
  };

  onFinished = () => {
    if (selectElementSignal.value && this.movingPoint && this.origin) {
      selectElementSignal.value.onMove(this.origin, this.movingPoint);
    }
    this.movingLine!.visible = false;
    (this.movingPoint as any) = null;
    (this.origin as any) = null;
    modifySignal.value = null;
  };
  dispose = () => {
    (this.movingPoint as any) = null;
    (this.origin as any) = null;
    this.movingLine!.visible = false;
  };
}
