import * as THREE from "three";
import {Components} from "../Components";
import {ToolComponent} from "../Tool";
import {
  Component,
  Disposable,
  INavigation,
  pixelRatio,
  Updateable,
  UUID,
} from "../types";
import {CubeMapMaterial, BoxCube} from "./src";
import {RendererComponent} from "../RendererComponent";
import {defaultBox, defaultSphere, switchPick} from "../utils";
import {IView} from "../LevelSystem/types";

const near = 1,
  far = 10000;
const pos0 = new THREE.Vector3(60, 60, 60);

export type ICubeMapPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export class CubeMapComponent
  extends Component<string>
  implements Disposable, Updateable
{
  static readonly uuid = UUID.CubeMapComponent;
  enabled = false;
  private materials = new CubeMapMaterial();
  box: THREE.Box3 = defaultBox;
  sphere: THREE.Sphere = defaultSphere();
  private container!: HTMLDivElement;
  private canvas!: HTMLCanvasElement;
  set align(position: ICubeMapPosition) {
    if (!this.container) return;
    if (position === "top-left") {
      this.container.style.left = "0px";
      this.container.style.top = "0px";
    } else if (position === "top-right") {
      this.container.style.right = "0px";
      this.container.style.top = "0px";
    } else if (position === "bottom-left") {
      this.container.style.left = "0px";
      this.container.style.bottom = "0px";
    } else if (position === "bottom-right") {
      this.container.style.right = "0px";
      this.container.style.bottom = "0px";
    }
  }

  private radius = 300;
  private readonly width = 100 as const;
  private readonly height = 100 as const;
  private rayCaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private scene: THREE.Scene = new THREE.Scene();
  private renderer!: THREE.WebGLRenderer;
  private boxCube!: BoxCube;

  private perspectiveCamera!: THREE.PerspectiveCamera;
  private orthographicCamera!: THREE.OrthographicCamera;
  private currentCamera!: THREE.OrthographicCamera | THREE.PerspectiveCamera;
  private ambientLight!: THREE.AmbientLight;
  private directionalLight!: THREE.DirectionalLight;

  private _projection = false;
  set projection(projection: boolean) {
    this._projection = projection;
    if (!this.perspectiveCamera)
      this.perspectiveCamera = this.initPerspectiveCamera();
    if (!this.orthographicCamera)
      this.orthographicCamera = this.initOrthographicCamera();
    this.currentCamera = projection
      ? this.perspectiveCamera
      : this.orthographicCamera;
  }
  get projection() {
    return this._projection;
  }
  set size(size: number) {
    this.perspectiveCamera.userData.radius = this.radius / size;
    this.orthographicCamera.userData.radius = this.radius / size;
    this.orthographicCamera.left = this.width / -size;
    this.orthographicCamera.right = this.width / size;
    this.orthographicCamera.top = this.height / size;
    this.orthographicCamera.bottom = this.height / -size;
  }
  private position = new THREE.Vector3();
  private target = new THREE.Vector3();
  private origin = new THREE.Vector3();
  get direction() {
    return this.position.clone().sub(this.target.clone()).normalize();
  }
  get rect(): DOMRect {
    if (!this.container) throw new Error("Not Initialized!");
    return this.container.getBoundingClientRect();
  }
  private _visible = false;
  set visible(visible: boolean) {
    if (!this.container || !this.components.container) return;
    if (this._visible === visible) return;
    this._visible = visible;
    if (visible) {
      this.components.container.appendChild(this.container);
    } else {
      this.container.remove();
    }
  }
  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(CubeMapComponent.uuid, this);
    this.init();
    this.projection = false;
    this.initLight();
    this.initRenderer();
    this.boxCube = new BoxCube(this.scene, this.materials);
    this.onHover();
    this.onPick();
    this.size = 0.6;
  }
  update(_delta?: number): void {
    const renderer = this.components.tools.get(RendererComponent);
    if (!renderer) return;
    const cameraControls = renderer.camera.cameraControls;
    if (!cameraControls) return;
    this.position = cameraControls.getPosition(this.position);
    this.target = cameraControls.getTarget(this.target);
    //
    //multiple from Vector3(0, 0,0)
    const newV = this.origin
      .clone()
      .add(this.direction.clone().multiplyScalar(this.radius));
    // set new Camera position
    this.currentCamera.position.set(newV.x, newV.y, newV.z);
    this.directionalLight.position.set(newV.x, newV.y, newV.z);
    this.currentCamera.lookAt(0, 0, 0);

    this.currentCamera.updateProjectionMatrix();
    this.renderer.render(this.scene, this.currentCamera);
  }
  async dispose() {
    this.boxCube?.dispose();
    (this.boxCube as any) = null;
    this.materials?.dispose();
    (this.materials as any) = null;
    this.renderer?.dispose();
    (this.renderer as any) = null;
    this.canvas?.remove();
    (this.canvas as any) = null;
    this.container?.remove();
    (this.container as any) = null;
  }
  get() {
    return CubeMapComponent.uuid;
  }
  private init() {
    const container = this.components.container;
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.container = document.createElement("div");
    this.container.style.width = this.width + "px";
    this.container.style.height = this.height + "px";
    this.container.style.position = "absolute";
    this.container.style.zIndex = "20";
    this.container.appendChild(this.canvas);
    this.visible = true;
    this.align = "top-right";
  }

  private initLight() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 2);
    this.scene.add(this.ambientLight);
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 2);
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
    this.scene.add(this.directionalLight);
    this.scene.add(this.directionalLight.target);
  }
  private initRenderer() {
    const {width, height} = this.rect;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      context: this.canvas.getContext("webgl2")!,
      antialias: true,
      precision: "highp", // 'lowp', 'mediump', 'highp'
      alpha: true,
      stencil: false,
      powerPreference: "high-performance",
      logarithmicDepthBuffer: true,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(pixelRatio);
  }

  /**
   *
   * @param {Event} event
   * @returns {object} object to wanna cast
   */
  private cast(event: any) {
    const {width, height, left, top} = this.rect;
    const x1 = event.clientX - left;
    const y1 = event.clientY - top;
    const x2 = width;
    this.mouse.x = (x1 / x2) * 2 - 1;
    const y2 = height;
    this.mouse.y = -(y1 / y2) * 2 + 1;
    this.rayCaster.setFromCamera(this.mouse, this.currentCamera);
    return this.rayCaster.intersectObjects(
      this.scene.children.filter((e) => e.userData.Element)
    );
  }
  /**
   *event when hover on Box
   */
  private found!: any;
  private onHover() {
    this.canvas.addEventListener("pointermove", (event: any) => {
      this.resetMaterial();
      this.found = this.cast(event)[0];
      if (!this.found) return;
      (this.found.object as THREE.Mesh).material = this.materials.hoverCube!;
    });
    this.canvas.addEventListener("pointerleave", () => {
      this.resetMaterial();
    });
  }
  /**
   * event when click and navigate view
   */
  private onPick() {
    this.canvas.addEventListener("click", (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!this.found) return;
      const name = this.found.object.name;
      if (!name) return;
      this.onNavigationView(name);
    });
  }
  /**
   * reset material with only object is children of scene has userData.Element=true or not null
   */
  private resetMaterial() {
    for (let i = 0; i < this.scene.children.length; i++) {
      if (this.scene.children[i].userData.Element) {
        (this.scene.children[i] as THREE.Mesh).material =
          this.materials.normalCube!;
      }
    }
  }
  private initPerspectiveCamera(): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(45, 1, near, far);
    camera.position.copy(pos0);
    camera.lookAt(0, 0, 0);
    return camera;
  }
  /**
   * OrthographicCamera
   */
  private initOrthographicCamera() {
    const camera = new THREE.OrthographicCamera(
      this.width / -2,
      this.width / 2,
      this.height / 2,
      this.height / -2,
      -far,
      far
    );
    camera.position.copy(pos0);
    camera.lookAt(0, 0, 0);
    return camera;
  }
  private onNavigationView(name: INavigation) {
    const controls =
      this.components.tools.get(RendererComponent).camera.cameraControls;
    const {center} = this.sphere;
    const pos = switchPick(name, this.sphere, this.box);
    controls.setLookAt(pos.x, pos.y, pos.z, center.x, center.y, center.z);
    controls.fitToSphere(this.sphere, true);
  }
  onNavigation3D() {
    const controls =
      this.components.tools.get(RendererComponent).camera.cameraControls;
    const {center} = this.sphere;
    const {max} = this.box;
    controls.setLookAt(max.x, max.y, max.z, center.x, center.y, center.z);
    controls.fitToSphere(this.sphere, true);
  }
  onNavigationElevation(view: IView) {
    if (view.viewType !== "Elevation" || !view.elevationType) return;
    const controls =
      this.components.tools.get(RendererComponent).camera.cameraControls;
    const {center} = this.sphere;
    const {max, min} = this.box;
    const pos = center.clone();
    switch (view.elevationType) {
      case "South":
        pos.set(0, center.y, max.z);
        break;
      case "West":
        pos.set(min.x, center.y, 0);
        break;
      case "East":
        pos.set(max.x, center.y, 0);
        break;
      case "North":
        pos.set(0, center.y, min.z);
        break;
    }
    controls.setLookAt(pos.x, pos.y, pos.z, center.x, center.y, center.z);
    controls.fitToSphere(this.sphere, true);
  }
}
ToolComponent.libraryUUIDs.add(CubeMapComponent.uuid);
