/**
 * @module RendererComponent
 */
import * as THREE from "three";
import {Components} from "../Components";
import {ToolComponent} from "../Tool";
import {
  Component,
  Disposable,
  pixelRatio,
  Resizeable,
  Updateable,
  UUID,
} from "../types";
import {CSS2DRenderer} from "three/examples/jsm/renderers/CSS2DRenderer";
import {Camera, Infinite2dGrid, PostProduction} from "./src";
import {WorkPlane} from "../WorkPlane";
import {effect} from "@preact/signals-react";
import {clippingPlanesSignal} from "../Signals";
export * from "./src";
/**
 *
 */
export class RendererComponent
  extends Component<THREE.WebGLRenderer>
  implements Disposable, Resizeable, Updateable
{
  static readonly uuid = UUID.RendererComponent;

  enabled = false;

  size: THREE.Vector2 = new THREE.Vector2();

  private ambientLight!: THREE.AmbientLight;

  private directionalLight!: THREE.DirectionalLight;

  public camera!: Camera;

  public labelRenderer!: CSS2DRenderer;

  public renderer!: THREE.WebGLRenderer;

  public postProduction!: PostProduction;

  public grid!: Infinite2dGrid;

  set setupEvents(setupEvents: boolean) {
    const controls = this.camera.cameraControls;
    const domElement = this.components.canvas;
    if (!controls || !domElement) return;
    if (setupEvents) {
      controls.addEventListener("control", this.onControl);
      controls.addEventListener("controlstart", this.onControlStart);
      controls.addEventListener("wake", this.onWake);
      controls.addEventListener("controlend", this.onControlEnd);
      controls.addEventListener("sleep", this.onSleep);
      controls.addEventListener("update", this.onUpdate);
      domElement.addEventListener("wheel", this.onWheel);
    } else {
      controls.removeEventListener("control", this.onControl);
      controls.removeEventListener("controlstart", this.onControlStart);
      controls.removeEventListener("wake", this.onWake);
      controls.removeEventListener("controlend", this.onControlEnd);
      controls.removeEventListener("sleep", this.onSleep);
      controls.removeEventListener("update", this.onUpdate);
      domElement.removeEventListener("wheel", this.onWheel);
    }
  }

  private isUserControllingCamera = false;

  private isControlSleeping = true;

  private lastWheelUsed = 0;

  private lastResized = 0;

  private resizeDelay = 200;
  /**
   *
   * @param components
   */
  constructor(components: Components) {
    super(components);

    this.components.tools.add(RendererComponent.uuid, this);

    this.camera = new Camera(this.components);

    this.camera.enabled = true;

    this.initRenderer();

    this.initLabelRenderer();

    this.initPostProduction();

    this.initTool();

    this.grid = new Infinite2dGrid(this.components, this.camera);

    this.setupEvents = true;

    effect(() => {
      this.renderer!.clippingPlanes = clippingPlanesSignal.value;
    });
  }
  /**
   *
   */
  async dispose() {
    this.enabled = false;

    this.setupEvents = false;

    this.grid?.dispose();

    (this.grid as any) = null;

    this.camera?.dispose();

    (this.camera as any) = null;

    this.postProduction?.dispose();

    (this.postProduction as any) = null;

    this.labelRenderer?.domElement.remove();

    (this.labelRenderer as any) = null;

    this.renderer?.dispose();

    (this.renderer as any) = null;
  }
  /**
   *
   * @returns
   */
  get() {
    return this.renderer;
  }
  /**
   *
   * @param delta
   */
  update(delta: number): void {
    this.camera?.update(delta!);

    // this.pathTracer.renderSample();

    const postProduction =
      this.postProduction.enabled && this.postProduction.visible;

    if (postProduction) {
      this.postProduction.update();
    } else {
      this.renderer.render(this.components.scene, this.camera.currentCamera);
    }
    this.labelRenderer.render(this.components.scene, this.camera.currentCamera);
  }
  /**
   *
   * @param size
   * @returns
   */
  resize(size?: THREE.Vector2 | undefined) {
    if (!size) return;

    this.size = size.clone();

    this.camera.resize(this.size);

    this.labelRenderer.setSize(this.size.x, this.size.y);

    this.renderer.setSize(this.size.x, this.size.y);

    if (this.postProduction.enabled) {
      this.lastResized = performance.now();

      this.postProduction.visible = false;

      setTimeout(() => {
        if (performance.now() - this.lastResized >= this.resizeDelay) {
          this.postProduction.visible = true;

          this.postProduction.setSize();
        }
      }, this.resizeDelay);
    }
    this.grid?.regenerate();
  }
  /**
   *
   * @returns
   */
  getSize() {
    return this.size;
  }
  /**
   *
   */
  private initRenderer() {
    const {width, height} = this.components.rect;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.components.canvas,
      context: this.components.canvas.getContext("webgl2")!,
      antialias: true,
      precision: "highp", // 'lowp', 'mediump', 'highp'
      alpha: true,
      stencil: false,
      powerPreference: "high-performance",
      logarithmicDepthBuffer: true,
    });

    this.renderer.setSize(width, height);

    this.renderer.setPixelRatio(pixelRatio);

    this.renderer.outputColorSpace = "srgb";

    this.renderer.localClippingEnabled = true;

    this.renderer.toneMapping = THREE.NoToneMapping;

    this.renderer.toneMappingExposure = 1;

    this.renderer.shadowMap.enabled = true;

    this.renderer.shadowMap.type = THREE.VSMShadowMap;

    this.renderer.shadowMap.autoUpdate = false;

    this.renderer.shadowMap.needsUpdate = true;

    this.renderer.autoClearStencil = false;

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
  }
  /**
   *
   */
  private initLabelRenderer() {
    const {width, height} = this.components.rect;

    this.size.x = width;

    this.size.y = height;

    this.labelRenderer = new CSS2DRenderer();

    this.labelRenderer.domElement.style.position = "absolute";

    this.labelRenderer.domElement.style.top = "0";

    this.labelRenderer.domElement.style.outline = "none";

    this.labelRenderer.domElement.style.border = "none";

    this.labelRenderer.domElement.style.zIndex = "50";

    this.labelRenderer.domElement.style.pointerEvents = "none";

    this.labelRenderer.setSize(width, height);

    this.components.container.appendChild(this.labelRenderer.domElement);
  }
  /**
   *
   */
  private initPostProduction() {
    this.postProduction = new PostProduction(
      this.components.scene,
      this.camera,
      this.renderer
    );

    this.postProduction.enabled = true;

    this.postProduction.customEffects.outlineEnabled = true;
  }
  /**
   *
   */
  private initTool() {
    this.ambientLight = new THREE.AmbientLight("white");
    this.components.scene.add(this.ambientLight);
    this.directionalLight = new THREE.DirectionalLight("white");
    this.directionalLight.intensity = 2;
    this.directionalLight.position.set(100, 100, 100);
    this.directionalLight.target.position.set(-5, 0, 0);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.bias = -0.001;
    this.directionalLight.shadow.mapSize.width = 2048;
    this.directionalLight.shadow.mapSize.height = 2048;
    this.directionalLight.shadow.camera.near = 0.1;
    this.directionalLight.shadow.camera.far = 1000.0;
    this.directionalLight.shadow.camera.left = 10;
    this.directionalLight.shadow.camera.right = -10;
    this.directionalLight.shadow.camera.top = 10;
    this.directionalLight.shadow.camera.bottom = -10;
    this.components.scene.add(this.directionalLight);
    this.components.scene.add(this.directionalLight.target);
  }
  /**
   *
   * @param _event
   */
  private onControlStart = (_event: any) => {
    this.isUserControllingCamera = true;
  };
  /**
   *
   * @param _event
   */
  private onWake = (_event: any) => {
    this.isControlSleeping = false;
  };
  /**
   *
   * @param _event
   * @returns
   */
  private onControl = (_event: any) => {
    this.components.cursor = this.components.ctrlKey ? 9 : 0;
    if (!this.postProduction.enabled) return;
    this.postProduction.visible = false;
  };
  /**
   *
   * @param _event
   * @returns
   */
  private onControlEnd = (_event: any) => {
    this.components.cursor = 0;
    if (!this.postProduction.enabled) return;
    this.isUserControllingCamera = false;
    if (!this.isUserControllingCamera && this.isControlSleeping) {
      this.postProduction.visible = true;
    }
  };
  /**
   *
   * @param _event
   */
  private onWheel = (_event: any) => {
    if (this.postProduction.enabled) {
      this.lastResized = performance.now();
    }
  };
  /**
   *
   * @param _event
   * @returns
   */
  private onSleep = (_event: any) => {
    if (!this.postProduction.enabled) return;
    this.isControlSleeping = true;
    const currentWheel = performance.now();
    setTimeout(() => {
      if (this.lastWheelUsed > currentWheel) return;

      if (!this.isUserControllingCamera && this.isControlSleeping) {
        this.postProduction.visible = true;
      }
    }, 100);
  };
  /**
   *
   */
  private onUpdate = () => {
    const materialGrid = this.components.tools.get(WorkPlane).material;
    materialGrid.uniforms.uZoom.value = this.camera.currentCamera.zoom;
    this.grid?.regenerate();
    // this.pathTracer.updateCamera();
  };
}
ToolComponent.libraryUUIDs.add(RendererComponent.uuid);
