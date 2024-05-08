import * as THREE from "three";
import {Component, Disposable} from "../types";
import {ToolComponent} from "../Tool";
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
} from "three-mesh-bvh";
import {effect} from "@preact/signals-react";
import {appTheme} from "@signals/theme";
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
  public canvas!: HTMLCanvasElement;
  private clock!: THREE.Clock;
  set setupEvent(enabled: boolean) {
    if (enabled) {
      window.addEventListener("resize", this.onResize);
    } else {
      window.removeEventListener("resize", this.onResize);
    }
  }
  get rect(): DOMRect {
    if (!this.container) throw new Error("Not Initialized!");
    return this.container.getBoundingClientRect();
  }
  constructor(public container: HTMLDivElement) {
    this.init();
    this.setupBVH();
    this.tools = new ToolComponent(this);
    this.setupEvent = true;
    effect(() => {
      this.scene.background = appTheme.value === "dark" ? sceneBG : null;
    });
  }
  async dispose() {
    this.enabled = false;
    this.setupEvent = false;
    this.canvas?.remove();
    (this.canvas as any) = null;
    await this.tools.dispose();
  }
  async init() {
    this.canvas = document.createElement("canvas");
    this.container.appendChild(this.canvas);
    const {width, height} = this.rect;
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.position = "absolute";
    this.canvas.style.zIndex = "5000";
    this.clock = this.initClock();
  }
  private onResize = () => {
    const {width, height} = this.container.getBoundingClientRect();
    const size = new THREE.Vector2(width, height);
    for (const name in this.tools.list) {
      if (this.tools.list[name].isResizeable()) {
        //@ts-ignore
        this.tools.list[name].resize!(size);
      }
    }
  };
  private initClock() {
    const clock = new THREE.Clock();
    clock.start();
    this.scene.add(new THREE.AxesHelper(5));
    return clock;
  }
  gameLoop = () => {
    const delta = this.clock.getDelta();
    this.tools.update(delta);
    const res = requestAnimationFrame(this.gameLoop);
    if (!this.enabled) cancelAnimationFrame(res);
  };

  private setupBVH() {
    THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
    THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
    THREE.Mesh.prototype.raycast = acceleratedRaycast;
  }
}
