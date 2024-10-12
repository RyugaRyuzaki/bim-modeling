import * as THREE from "three";
import {Model} from "clay";
import {Disposable} from "../types";
import {ToolComponent} from "../Tool";
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
} from "three-mesh-bvh";
import {effect} from "@preact/signals-react";
import {appTheme} from "@signals/theme";
import {
  isModelingSignal,
  isOrthoSignal,
  keyboardSignal,
  selectViewSignal,
} from "../Signals";
import {RendererComponent} from "../RendererComponent";
import {SceneBuilder} from "./SceneBuilder";
/**
 * The entry point of Open BIM Components.
 * It contains the basic items to create a BIM 3D scene based on Three.js, as
 * well as all the tools provided by this library. It also manages the update
 * loop of everything. Each instance has to be initialized with {@link init}.
 *
 */
const sceneBG = new THREE.Color(0x202932);
export class Components implements Disposable {
  /** {@link ToolComponent} */
  readonly tools: ToolComponent;

  /**
   * All the loaded [meshes](https://threejs.org/docs/#api/en/objects/Mesh).
   * This includes fragments, 3D scans, etc.
   */

  enabled = true;

  public scene = new THREE.Scene();

  public modelScene = new SceneBuilder();

  public annotationScene = new SceneBuilder();

  public clippingScene = new SceneBuilder();

  public canvas!: HTMLCanvasElement;

  private clock!: THREE.Clock;

  get rect(): DOMRect {
    if (!this.container) throw new Error("Not Initialized!");
    return this.container.getBoundingClientRect();
  }

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

  set cursor(type: number) {
    this.canvas.style.cursor = this.cursorTypes[type];
  }

  private _ctrlKey = false;

  set ctrlKey(ctrlKey: boolean) {
    const mouseButtons =
      this.tools.get(RendererComponent)!.camera.cameraControls.mouseButtons;

    if (!mouseButtons) return;

    this._ctrlKey =
      selectViewSignal.value !== null &&
      selectViewSignal.value.viewType === "3D" &&
      ctrlKey;

    mouseButtons.left = this._ctrlKey ? 1 : 0;
  }

  get ctrlKey() {
    return this._ctrlKey;
  }

  set setupEvent(enabled: boolean) {
    if (enabled) {
      window.addEventListener("resize", this.onResize);
      document.addEventListener("keydown", this.onKeyDown);
      document.addEventListener("keyup", this.onKeyUp);
    } else {
      window.removeEventListener("resize", this.onResize);
      document.removeEventListener("keydown", this.onKeyDown);
      document.removeEventListener("keyup", this.onKeyUp);
    }
  }

  ifcModel: Model = new Model();

  /**
   *
   * @param container
   */
  constructor(public container: HTMLDivElement) {
    this.init();

    this.setupBVH();

    this.tools = new ToolComponent(this);

    this.scene.add(this.modelScene);

    this.scene.add(this.annotationScene);

    this.modelScene.renderOrder = 10;

    this.annotationScene.renderOrder = 10;

    this.ifcModel.ifcAPI.SetWasmPath("https://unpkg.com/web-ifc@0.0.59/", true);

    this.setupEvent = true;

    effect(() => {
      this.scene.background = appTheme.value === "dark" ? null : sceneBG;
    });
  }
  /**
   *
   */
  async dispose() {
    this.enabled = false;

    this.setupEvent = false;

    this.canvas?.remove();

    (this.canvas as any) = null;

    this.modelScene.dispose();

    this.modelScene.removeFromParent();

    (this.modelScene as any) = null;

    this.annotationScene.dispose();

    this.annotationScene.removeFromParent();

    (this.annotationScene as any) = null;

    this.clippingScene.dispose();

    this.clippingScene.removeFromParent();

    (this.clippingScene as any) = null;

    (this.scene as any) = null;

    (this.ifcModel as any) = null;

    this.ifcModel = new Model();

    await this.tools.dispose();
  }
  /**
   *
   */
  async init() {
    this.canvas = document.createElement("canvas");

    this.container.appendChild(this.canvas);

    const {width, height} = this.rect;

    this.canvas.width = width;

    this.canvas.height = height;

    this.canvas.style.width = "100%";

    this.canvas.style.height = "100%";

    this.canvas.style.position = "absolute";

    this.canvas.style.zIndex = "10";

    this.scene.backgroundBlurriness = 0.05;

    this.clock = this.initClock();
  }
  /**
   *
   */
  onResize = () => {
    const {width, height} = this.container.getBoundingClientRect();

    const size = new THREE.Vector2(width, height);

    for (const name in this.tools.list) {
      if (this.tools.list[name].isResizeable()) {
        //@ts-ignore
        this.tools.list[name].resize!(size);
      }
    }
  };
  /**
   *
   * @param e
   */
  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && isModelingSignal.value)
      isModelingSignal.value = false;

    if (e.key === "F8") isOrthoSignal.value = !isOrthoSignal.value;

    keyboardSignal.value = e.key;

    this.ctrlKey = e.key === "Control";
  };
  /**
   *
   * @param _e
   */
  private onKeyUp = (_e: KeyboardEvent) => {
    keyboardSignal.value = null;

    this.ctrlKey = false;
  };
  /**
   *
   * @returns
   */
  private initClock() {
    const clock = new THREE.Clock();

    clock.start();

    this.scene.add(new THREE.AxesHelper(2));

    return clock;
  }
  /**
   *
   */
  gameLoop = () => {
    const delta = this.clock.getDelta();

    this.tools.update(delta);

    const res = requestAnimationFrame(this.gameLoop);

    if (!this.enabled) cancelAnimationFrame(res);
  };
  /**
   *
   */
  private setupBVH() {
    THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
    THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
    THREE.Mesh.prototype.raycast = acceleratedRaycast;
  }
}
