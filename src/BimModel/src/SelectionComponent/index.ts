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
import {changeInputSignal, selectElementSignal} from "../Signals";
import {createContextMenu} from "./src";

/**
 *
 */
export class SelectionComponent extends Component<any> implements Disposable {
  static readonly uuid = UUID.SelectionComponent;

  enabled = false;

  private readonly hoverColor = new THREE.Color("#6528D7");

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
    return this.components.canvas;
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
      this.container.addEventListener("contextmenu", this.onContextMenu);
    } else {
      this.container.removeEventListener("click", this.onClick);
      this.container.removeEventListener("mousemove", this.onMouseMove);
      this.container.removeEventListener("mousedown", this.onMousedown);
      this.container.removeEventListener("mouseup", this.onMouseup);
      this.container.removeEventListener("contextmenu", this.onContextMenu);
    }
  }

  get setupEvent() {
    return this._setupEvent;
  }

  private mousedown = false;

  private _found: THREE.Intersection | null = null;

  set find(event: MouseEvent | null) {
    if (!event) {
      this._found = null;
      return;
    }
    this.components.tools.get(RaycasterComponent)!.mouseMove = event;
    this._found = this.RaycasterComponent.castRay();
  }

  get found() {
    return this._found;
  }

  private _select: ElementLocation | null = null;

  set select(found: THREE.Intersection | null) {
    if (this._select) {
      this._select.select = false;
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
      this._select.select = true;
      this.clear();
    } else {
      this.showContextMenu = false;
    }
    selectElementSignal.value = this._select;
  }

  private _hover: {[id: string]: number} = {};

  set hover(found: THREE.Intersection | null) {
    if (this._select) return;
    this.clear();
    if (
      !found ||
      !found.object ||
      !(found.object instanceof FragmentMesh) ||
      !found.object.fragment ||
      found.instanceId === undefined
    )
      return;
    const itemID = found.object.fragment.getItemID(found.instanceId);
    if (!itemID) return;
    const {ids} = found.object.fragment;
    for (const id of ids) {
      if (!this.elements[+id]) continue;
      if (!this.elements[+id].element) continue;
      const clones = this.elements[+id].element.type.clones;
      for (const [_id, clone] of clones) {
        clone.setColor(this.hoverColor, [itemID]);
      }
      if (!this._hover[id]) this._hover[id] = itemID;
    }
  }

  private contextMenu!: HTMLDivElement;

  private _showContextMenu = false;

  set showContextMenu(show: boolean) {
    this._showContextMenu = show;

    if (!this.contextMenu) this.contextMenu = createContextMenu(this);

    if (show) {
      this.components.container.appendChild(this.contextMenu);
    } else {
      this.contextMenu?.remove();
    }
  }

  get showContextMenu() {
    return this._showContextMenu;
  }
  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(SelectionComponent.uuid, this);
  }
  /**
   *
   */
  async dispose() {
    this.enabled = false;

    this.setupEvent = false;

    this._hover = {};

    this._select = null;

    this.contextMenu?.remove();

    (this.contextMenu as any) = null;
  }
  /**
   *
   */
  get() {
    throw new Error("Method not implemented.");
  }
  /**
   *
   * @param ids
   * @returns
   */
  getElement(ids: Set<number>): ElementLocation | null {
    for (const id of ids) {
      if (this.elements[id]) return this.elements[id];
    }
    return null;
  }
  /**
   *
   */
  private clear() {
    for (const id in this._hover) {
      if (!this.elements[+id]) continue;

      if (!this.elements[+id].element) continue;

      const itemId = this._hover[id];

      const clones = this.elements[+id].element.type.clones;

      for (const [_id, clone] of clones) {
        clone.resetColor([itemId]);
      }
    }

    this._hover = {};
  }
  /**
   *
   * @param _e
   * @returns
   */
  private onClick = (_e: MouseEvent) => {
    _e.preventDefault();
    _e.stopPropagation();
    if (this.mousedown || changeInputSignal.value) return;
    this.select = this.found;
  };
  /**
   *
   * @param _e
   * @returns
   */
  private onMouseMove = (_e: MouseEvent) => {
    if (this.mousedown) return;
    this.find = _e;
    // this.hover = this.found;
  };
  /**
   *
   * @param _e
   */
  private onMousedown = (_e: MouseEvent) => {
    if (_e.button === 0) {
      this.mousedown = true;
    }
  };
  /**
   *
   */
  private onMouseup = () => {
    this.mousedown = false;
  };
  /**
   *
   * @param _e
   */
  private onContextMenu = (_e: MouseEvent) => {
    _e.preventDefault();
    _e.stopPropagation();
    this.showContextMenu = this._select !== null && this._select !== undefined;

    const {clientX, clientY} = _e;

    const bounds = this.components.rect;

    this.contextMenu.style.top = `${clientY - bounds.top}px`;

    this.contextMenu.style.left = `${clientX - bounds.left + 10}px`;
  };
}
//
ToolComponent.libraryUUIDs.add(SelectionComponent.uuid);
