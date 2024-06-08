/**
 * @module ModelingComponent
 */
import * as THREE from "three";

import {Components} from "../Components";
import {MaterialComponent} from "../MaterialComponent";
import {ProjectComponent} from "../ProjectComponent";
import {RaycasterComponent} from "../RaycasterComponent";
import {ToolComponent} from "../Tool";
import {Component, Disposable, UUID} from "../types";
import {FragmentMesh} from "clay";
import {ElementLocation} from "../system";
import {selectElementSignal} from "../Signals";

/**
 *
 */
export class SelectionComponent extends Component<any> implements Disposable {
  static readonly uuid = UUID.SelectionComponent;
  enabled = false;
  private readonly cursorTypes = [
    "default",
    "pointer",
    "move",
    "zoom-in",
    "url('./icons/canvas-cursor.svg'), auto",
    "url('./icons/comment-cursor.svg'), auto",
    "url('./icons/extrude-cursor.svg'), auto",
    "url('./icons/highlighter-cursor.svg'), auto",
    "url('./icons/marker-cursor.svg'), auto",
    "url('./icons/orbit-cursor.svg'), auto",
    "url('./icons/pen-cursor.svg'), auto",
    "url('./icons/pencil-cursor.svg'), auto",
    "url('./icons/Equipment.svg'), auto",
    "not-allowed",
  ];
  get modelScene() {
    return this.components.modelScene;
  }

  get RaycasterComponent() {
    return this.components.tools.get(RaycasterComponent);
  }
  get MaterialComponent() {
    return this.components.tools.get(MaterialComponent);
  }
  get ProjectComponent() {
    return this.components.tools.get(ProjectComponent);
  }
  get elements() {
    return this.ProjectComponent?.elements;
  }
  get camera() {
    return this.RaycasterComponent.currentCamera;
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
    } else {
      this.container.removeEventListener("click", this.onClick);
      this.container.removeEventListener("mousemove", this.onMouseMove);
      this.container.removeEventListener("mousedown", this.onMousedown);
      this.container.removeEventListener("mouseup", this.onMouseup);
    }
  }
  get setupEvent() {
    return this._setupEvent;
  }
  private mousedown = false;
  set cursor(type: number) {
    this.container.style.cursor = this.cursorTypes[type];
  }
  private _found: THREE.Intersection | null = null;
  set find(event: MouseEvent | null) {
    if (!event) {
      this._found = null;
      return;
    }
    this.components.tools.get(RaycasterComponent)!.mouseMove = event;
    this._found = this.RaycasterComponent.castRay();
    this.cursor = this._found ? 4 : 0;
  }
  get found() {
    return this._found;
  }
  private _select: ElementLocation | null = null;
  set select(found: THREE.Intersection | null) {
    if (this._select && this._select.location) {
      this._select.location.visible = false;
      this._select = null;
    }
    if (
      !found ||
      !found.object ||
      !(found.object instanceof FragmentMesh) ||
      !found.object.fragment
    ) {
      this._select = null;
    } else {
      const {ids} = found.object.fragment;
      this._select = this.getElement(ids);
    }
    if (this._select) {
      this._select.location.visible = true;
    }
    selectElementSignal.value = this._select;
  }

  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(SelectionComponent.uuid, this);
    this.setupEvent = true;
  }
  async dispose() {
    this.setupEvent = false;
  }

  get() {
    throw new Error("Method not implemented.");
  }
  getElement(ids: Set<number>): ElementLocation | null {
    for (const id of ids) {
      if (this.elements[id]) return this.elements[id];
    }
    return null;
  }
  onClick = (_e: MouseEvent) => {
    if (this.mousedown) return;
    this.select = this.found;
  };
  onMouseMove = (_e: MouseEvent) => {
    if (this.mousedown) return;
    this.find = _e;
  };
  onMousedown = (_e: MouseEvent) => {
    if (_e.button === 0) this.mousedown = true;
  };
  private onMouseup = () => {
    this.mousedown = false;
  };
}
//
ToolComponent.libraryUUIDs.add(SelectionComponent.uuid);
