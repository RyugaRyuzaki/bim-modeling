/**
 * @module RaycasterComponent
 */

import * as THREE from "three";
import {Components} from "@BimModel/src/Components";
import {ToolComponent} from "@BimModel/src/Tool";
import {Component, Disposable, UUID} from "@BimModel/src/types";
import {RendererComponent} from "../RendererComponent";
import {lengthUnitSignal} from "../Signals";

const positionInfoClass = {
  positionInfo:
    "absolute  top-[10px] left-[10px] z-3000 flex justify-start round-md",
  location:
    "text-[12px] text-white text-center font-bold my-auto bg-slate-500 p-1 border-1 border-slate-500 ",
  value:
    "text-[12px] text-black  font-bold flex-1 my-auto  bg-slate-50 p-1 text-right border-1 border-slate-500 min-w-[70px]",
};

export class RaycasterComponent
  extends Component<string>
  implements Disposable
{
  static readonly uuid = UUID.RaycasterComponent;
  enabled = false;
  private positionInfo!: HTMLDivElement;
  private valueX!: HTMLParagraphElement;
  private valueY!: HTMLParagraphElement;
  private valueZ!: HTMLParagraphElement;
  public delta!: HTMLParagraphElement;
  public mouse: THREE.Vector2 = new THREE.Vector2();
  public currentPoint: THREE.Vector3 = new THREE.Vector3();
  public raycaster: THREE.Raycaster = new THREE.Raycaster();
  set mouseMove(event: MouseEvent) {
    const {left, right, top, bottom} = this.components.rect;
    this.mouse.x = ((event.clientX - left) / (right - left)) * 2 - 1;
    this.mouse.y = -((event.clientY - top) / (bottom - top)) * 2 + 1;
  }
  get currentCamera() {
    return this.components.tools.get(RendererComponent)?.camera.currentCamera;
  }
  private _visibleInfo = false;
  set visibleInfo(visible: boolean) {
    if (!this.components.container) return;
    if (this._visibleInfo === visible) return;
    this._visibleInfo = visible;
    if (!this.positionInfo) this.initPositionInfo();
    if (visible) {
      this.components.container.appendChild(this.positionInfo);
    } else {
      this.positionInfo.remove();
    }
  }
  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(RaycasterComponent.uuid, this);
  }
  async dispose() {}

  get() {
    return RaycasterComponent.uuid;
  }
  getPointRayCasPlane(currentPlane: THREE.Plane) {
    this.raycaster.setFromCamera(this.mouse, this.currentCamera);
    return this.raycaster.ray.intersectPlane(currentPlane, this.currentPoint);
  }
  /**
   * initPositionInfo
   * using for
   */
  private initPositionInfo() {
    const pX = document.createElement("p");
    pX.className = positionInfoClass.location;
    pX.textContent = "X";
    const pY = document.createElement("p");
    pY.className = positionInfoClass.location;
    pY.textContent = "Y";
    const pZ = document.createElement("p");
    pZ.className = positionInfoClass.location;
    pZ.textContent = "Z";
    const pDelta = document.createElement("p");
    pDelta.className = positionInfoClass.location;
    pDelta.textContent = "d";

    this.valueX = document.createElement("p");
    this.valueX.className = positionInfoClass.value;
    this.valueY = document.createElement("p");
    this.valueY.className = positionInfoClass.value;
    this.valueZ = document.createElement("p");
    this.valueZ.className = positionInfoClass.value;
    this.delta = document.createElement("p");
    this.delta.className = positionInfoClass.value;
    this.delta.textContent = lengthUnitSignal.value.symbol;
    this.positionInfo = document.createElement("div");
    this.positionInfo.className = positionInfoClass.positionInfo;

    this.positionInfo.appendChild(pX);
    this.positionInfo.appendChild(this.valueX);
    this.positionInfo.appendChild(pY);
    this.positionInfo.appendChild(this.valueY);
    this.positionInfo.appendChild(pZ);
    this.positionInfo.appendChild(this.valueZ);
    this.positionInfo.appendChild(pDelta);
    this.positionInfo.appendChild(this.delta);
  }
  updateInfo(point: THREE.Vector3) {
    if (!this.positionInfo) return;
    const {x, y, z} = point;
    const {factor, toFixed} = lengthUnitSignal.value;
    this.valueX.textContent = `${(x * factor).toFixed(toFixed)}`;
    this.valueY.textContent = `${(y * factor).toFixed(toFixed)}`;
    this.valueZ.textContent = `${(z * factor).toFixed(toFixed)}`;
  }
}
ToolComponent.libraryUUIDs.add(RaycasterComponent.uuid);
