/**
 * @module RaycasterComponent
 */

import * as THREE from "three";
import {Components} from "@BimModel/src/Components";
import {ToolComponent} from "@BimModel/src/Tool";
import {Component, Disposable, UUID} from "@BimModel/src/types";
import {RendererComponent} from "../RendererComponent";
import {
  clippingPlanesSignal,
  gridXSignal,
  gridYSignal,
  lengthUnitSignal,
} from "../Signals";
import {GridSystem} from "../GridSystem";

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
    const bounds = this.components.rect;
    const x1 = event.clientX - bounds.left;
    const y1 = event.clientY - bounds.top;
    const x2 = bounds.right - bounds.left;
    const y2 = bounds.bottom - bounds.top;
    this.mouse.x = (x1 / x2) * 2 - 1;
    this.mouse.y = -(y1 / y2) * 2 + 1;
  }

  get currentCamera() {
    return this.RendererComponent?.camera.currentCamera;
  }

  get RendererComponent() {
    return this.components.tools.get(RendererComponent);
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
  get meshes() {
    return this.components.modelScene.children;
  }

  /**
   *
   */
  constructor(components: Components) {
    super(components);

    this.components.tools.add(RaycasterComponent.uuid, this);

    this.raycaster.firstHitOnly = true;

    this.raycaster.params.Points!.threshold = 50;
  }
  /**
   *
   */
  async dispose() {
    this.positionInfo?.remove();
    (this.positionInfo as any) = null;
  }
  /**
   *
   * @returns
   */
  get() {
    return RaycasterComponent.uuid;
  }
  /**
   *
   * @param currentPlane
   * @returns
   */
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
  /**
   *
   * @param point
   * @returns
   */
  updateInfo(point: THREE.Vector3) {
    if (!this.positionInfo) return;
    const {x, y, z} = point;
    const {factor, toFixed} = lengthUnitSignal.value;
    this.valueX.textContent = `${(x * factor).toFixed(toFixed)}`;
    this.valueY.textContent = `${(y * factor).toFixed(toFixed)}`;
    this.valueZ.textContent = `${(z * factor).toFixed(toFixed)}`;
  }
  /**
   *
   * @param items
   * @returns
   */
  castRay(items = this.meshes): THREE.Intersection | null {
    this.raycaster.setFromCamera(this.mouse, this.currentCamera);
    return this.intersect(items);
  }
  /**
   *
   * @param origin
   * @param direction
   * @param items
   * @returns
   */
  castRayFromVector(
    origin: THREE.Vector3,
    direction: THREE.Vector3,
    items = this.meshes
  ) {
    this.raycaster.set(origin, direction);
    return this.intersect(items);
  }
  /**
   *
   * @param items
   * @returns
   */
  intersect(items = this.meshes) {
    const result = this.raycaster.intersectObjects(items, true);
    const filtered = this.filterClippingPlanes(result);
    return filtered.length > 0 ? filtered[0] : null;
  }
  /**
   *
   * @param objs
   * @returns
   */
  private filterClippingPlanes(objs: THREE.Intersection[]) {
    if (clippingPlanesSignal.value.length === 0) {
      return objs;
    }
    const planes = clippingPlanesSignal.value;
    if (objs.length <= 0 || !planes || planes?.length <= 0) return objs;
    return objs.filter((elem: any) =>
      planes.every((elem2: any) => elem2.distanceToPoint(elem.point) > 0)
    );
  }
}
ToolComponent.libraryUUIDs.add(RaycasterComponent.uuid);
