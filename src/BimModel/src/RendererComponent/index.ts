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
import {Camera, PostProduction} from "./src";
import {WorkPlaneSystem} from "../system";
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
  public camera!: Camera;
  public labelRenderer!: CSS2DRenderer;
  public renderer!: THREE.WebGLRenderer;
  public postProduction!: PostProduction;
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

  constructor(components: Components) {
    super(components);
    this.components.tools.add(RendererComponent.uuid, this);
    this.camera = new Camera(this.components);
    this.camera.enabled = true;

    this.initRenderer();
    this.initLabelRenderer();
    this.initPostProduction();

    this.setupEvents = true;
  }
  async dispose() {
    this.enabled = false;
    this.setupEvents = false;
    this.camera?.dispose();
    (this.camera as any) = null;
    this.postProduction?.dispose();
    (this.postProduction as any) = null;
    this.labelRenderer?.domElement.remove();
    (this.labelRenderer as any) = null;
    this.renderer?.dispose();
    (this.renderer as any) = null;
  }
  get() {
    return this.renderer;
  }
  update(delta: number): void {
    this.camera?.update(delta!);
    const postProduction =
      this.postProduction.enabled && this.postProduction.visible;
    if (postProduction) {
      this.postProduction.update();
    } else {
      this.renderer.render(this.components.scene, this.camera.currentCamera);
    }
  }
  resize(size?: THREE.Vector2 | undefined) {
    if (!size) return;
    this.size = size.clone();
    this.camera.resize(this.size);
    this.labelRenderer.setSize(this.size.x, this.size.y);
    this.renderer.setSize(this.size.x, this.size.y);
    if (!this.postProduction.enabled) return;
    this.lastResized = performance.now();
    this.postProduction.visible = false;

    setTimeout(() => {
      if (performance.now() - this.lastResized >= this.resizeDelay) {
        this.postProduction.visible = true;
        this.postProduction.setSize();
      }
    }, this.resizeDelay);
  }
  getSize() {
    return this.size;
  }

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
  private initLabelRenderer() {
    const {width, height} = this.components.rect;
    this.size.x = width;
    this.size.y = height;
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.domElement.style.position = "absolute";
    this.labelRenderer.domElement.style.top = "0";
    this.labelRenderer.domElement.style.outline = "none";
    this.labelRenderer.domElement.style.border = "none";
    this.labelRenderer.domElement.style.zIndex = "0";
    this.labelRenderer.setSize(width, height);
    this.components.container.appendChild(this.labelRenderer.domElement);
  }
  private initPostProduction() {
    this.postProduction = new PostProduction(
      this.components.scene,
      this.camera,
      this.renderer
    );
    this.postProduction.enabled = true;
    this.postProduction.customEffects.outlineEnabled = true;
  }
  private onControlStart = (_event: any) => {
    this.isUserControllingCamera = true;
  };
  private onWake = (_event: any) => {
    this.isControlSleeping = false;
  };

  private onControl = (_event: any) => {
    if (!this.postProduction.enabled) return;
    this.postProduction.visible = false;
  };

  private onControlEnd = (_event: any) => {
    if (!this.postProduction.enabled) return;
    this.isUserControllingCamera = false;
    if (!this.isUserControllingCamera && this.isControlSleeping) {
      this.postProduction.visible = true;
    }
  };

  private onWheel = (_event: any) => {
    if (!this.postProduction.enabled) return;
    this.lastResized = performance.now();
  };

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
  private onUpdate = () => {
    const materialGrid = this.components.tools.get(WorkPlaneSystem).material;
    materialGrid.uniforms.uZoom.value = this.camera.currentCamera.zoom;
  };
}
ToolComponent.libraryUUIDs.add(RendererComponent.uuid);
