/**
 * @module Snapper
 */

import * as THREE from "three";
import {Components} from "@BimModel/src/Components";
import {ToolComponent} from "@BimModel/src/Tool";
import {Component, Disposable, UUID} from "@BimModel/src/types";
import {RaycasterComponent} from "../RaycasterComponent";
import {ProjectComponent} from "../ProjectComponent";
import {CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer";
import {ISnapper, ISnapTriangle} from "./types";
import {SnapUtils} from "../utils";
import {FragmentMesh} from "clay";
import {GeometryCSS} from "../system";
import {SelectionComponent} from "../SelectionComponent";
import {GridSystem} from "../GridSystem";
/**
 *
 */
export class Snapper extends Component<string> implements Disposable {
  static readonly uuid = UUID.Snapper;
  static readonly tolerance = 0.1;
  static readonly tempMatrix = new THREE.Matrix4();
  enabled = false;
  workPlane!: THREE.Plane | null;
  private label!: CSS2DObject;
  private domElement!: HTMLDivElement;

  private _snap!: THREE.Vector3 | null;
  get snap() {
    return this._snap;
  }
  set visible(visible: boolean) {
    if (!this.label) return;
    if (visible) {
      this.components.annotationScene.add(this.label);
    } else {
      this.label.removeFromParent();
    }
  }

  includes: ISnapper[] = [];
  get SelectionComponent() {
    return this.components.tools.get(SelectionComponent);
  }
  get container() {
    return this.components.container;
  }
  get RaycasterComponent() {
    return this.components.tools.get(RaycasterComponent);
  }
  get ProjectComponent() {
    return this.components.tools.get(ProjectComponent);
  }
  get GridSystem() {
    return this.components.tools.get(GridSystem);
  }
  get gridIntersect(): ISnapper[] {
    if (!this.workPlane) return [];
    return this.GridSystem.intersects.map((p) => {
      return {
        point: this.workPlane!.projectPoint(p, new THREE.Vector3()),
        css: GeometryCSS.snap.intersect,
      } as ISnapper;
    });
  }
  get elements() {
    return this.ProjectComponent?.elements;
  }
  set setupEvent(enabled: boolean) {
    if (!this.container) return;
    if (enabled) {
      document.addEventListener("keydown", this.onKeyDown);
    } else {
      document.addEventListener("keydown", this.onKeyDown);
    }
  }
  set snapGrid(point: THREE.Vector3 | null) {
    this._snap = null;
    this.visible = false;
    if (!point) return;

    this.getSnap(this.gridIntersect, point);
  }

  private _found: THREE.Intersection | null = null;
  set find(event: MouseEvent) {
    this.snapper = null;
    this.components.tools.get(RaycasterComponent)!.mouseMove = event;
    this._found = this.RaycasterComponent.castRay();
    this.SelectionComponent.cursor = this._found ? 4 : 0;
    if (!this._found) {
      return;
    }
    if (!this._found.object) return;
    const {face, instanceId, object, point} = this._found;

    if (object instanceof FragmentMesh) {
      if (instanceId === undefined || !face) return;

      // check instance and face
      if (!object.geometry.index || !object.geometry.attributes.position)
        return;
      const {a, b, c} = face;
      // update matrix
      object.updateMatrixWorld(true);
      // get matrix
      object.getMatrixAt(instanceId, Snapper.tempMatrix);
      const posArray = object.geometry.attributes.position;
      this.snapper = {
        currentPoint: point.clone(),
        trianglePoints: [
          this.getPoint(posArray, a),
          this.getPoint(posArray, b),
          this.getPoint(posArray, c),
        ],
      } as ISnapTriangle;
    }
  }
  get found() {
    return this._found;
  }

  set snapper(snapper: ISnapTriangle | null) {
    this._snap = null;
    this.visible = false;
    if (!this.enabled || !snapper) return;
    const {trianglePoints, currentPoint} = snapper;
    if (trianglePoints.length !== 3) return;
    const middlePoints =
      SnapUtils.getMiddlePointsOfTriangleMesh(trianglePoints);
    const intersects = SnapUtils.getProjectPointsOfTriangleMesh(
      trianglePoints,
      currentPoint
    );
    const pointTypes = [
      ...trianglePoints.map((p: THREE.Vector3) => {
        return {
          point: this.workPlane
            ? this.workPlane.projectPoint(p, new THREE.Vector3())
            : p.clone(),
          css: GeometryCSS.snap.endpoint,
        } as ISnapper;
      }),
      ...middlePoints.map((p: THREE.Vector3) => {
        return {
          point: this.workPlane
            ? this.workPlane.projectPoint(p, new THREE.Vector3())
            : p.clone(),
          css: GeometryCSS.snap.middle,
        } as ISnapper;
      }),
      ...intersects.map((p: THREE.Vector3) => {
        return {
          point: this.workPlane
            ? this.workPlane.projectPoint(p, new THREE.Vector3())
            : p.clone(),
          css: GeometryCSS.snap.intersect,
        } as ISnapper;
      }),
      ...this.includes,
    ];
    this.getSnap(pointTypes, currentPoint);
  }
  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(Snapper.uuid, this);
    this.init();
    this.setupEvent = true;
  }
  async dispose() {
    this.enabled = false;
    this.setupEvent = false;
    this.workPlane = null;
    this._found = null;
    this.domElement?.remove();
    (this.domElement as any) = null;
    this.label?.removeFromParent();
    (this.label as any) = null;
    this.includes = [];
  }

  get() {
    return Snapper.uuid;
  }
  getSnap(pointTypes: ISnapper[], currentPoint: THREE.Vector3) {
    for (let i = 0; i < pointTypes.length; i++) {
      const snap = pointTypes[i];
      if (currentPoint.distanceTo(snap.point) <= Snapper.tolerance) {
        this.visible = true;
        this._snap = snap.point;
        this.updatePoint(snap.point, snap.css);
        break;
      }
    }
  }
  getSnapperLineVector(segment: THREE.Line, point: THREE.Vector3) {
    if (!this.workPlane || !segment.geometry) return;
    const position = segment.geometry.attributes.position.array;
    if (!position) return;
    const start = this.workPlane.projectPoint(
      new THREE.Vector3(position[0], position[1], position[2]),
      new THREE.Vector3()
    );
    const end = this.workPlane.projectPoint(
      new THREE.Vector3(position[3], position[4], position[5]),
      new THREE.Vector3()
    );
    const proStart = SnapUtils.getProjectPointFrom3Point(start, end, point);
    this.visible = true;
    this._snap = proStart;
    this.updatePoint(proStart, GeometryCSS.snap.intersect);
  }
  private onKeyDown = (_e: KeyboardEvent) => {};
  /**
   *
   */
  private init() {
    this.domElement = document.createElement("div");
    this.domElement.className = GeometryCSS.snap.endpoint;
    this.label = new CSS2DObject(this.domElement);
  }
  private updatePoint(p: THREE.Vector3, css: string) {
    this.label.position.copy(p);
    this.domElement.className = css;
  }
  private getPoint(posArray: any, index: number): THREE.Vector3 {
    const x = posArray.getX(index);
    const y = posArray.getY(index);
    const z = posArray.getZ(index);
    const p = new THREE.Vector3(x, y, z);
    p.applyMatrix4(Snapper.tempMatrix);
    return p;
  }
}
ToolComponent.libraryUUIDs.add(Snapper.uuid);
