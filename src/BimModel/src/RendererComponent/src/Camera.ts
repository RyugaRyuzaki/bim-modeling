/**
 * @module CameraComponent
 */
import * as THREE from "three";
import CameraControls from "camera-controls";
import {Disposable, Resizeable, Updateable} from "../../types";
import {Components} from "../../Components";
import {initOrthographicCamera, initPerspectiveCamera} from "../../utils";

CameraControls.install({
  THREE,
});
/**
 *
 */
export class Camera implements Disposable, Resizeable, Updateable {
  protected readonly _frustumSize = 50;
  enabled = false;

  private perspectiveCamera!: THREE.PerspectiveCamera;
  private orthographicCamera!: THREE.OrthographicCamera;
  currentCamera!: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  cameraControls!: CameraControls;
  size: THREE.Vector2 = new THREE.Vector2();
  get width() {
    return this.size.x;
  }
  get height() {
    return this.size.y;
  }
  private _projection = false;
  set projection(projection: boolean) {
    this._projection = projection;
    const {x, y} = this.size;
    if (!this.perspectiveCamera)
      this.perspectiveCamera = initPerspectiveCamera(x / y);
    if (!this.orthographicCamera)
      this.orthographicCamera = initOrthographicCamera(x, y);
    this.currentCamera = projection
      ? this.perspectiveCamera
      : this.orthographicCamera;
  }
  get projection() {
    return this._projection;
  }

  constructor(private components: Components) {
    this.init();
  }
  async dispose() {
    this.enabled = false;
    this.perspectiveCamera.removeFromParent();
    (this.perspectiveCamera as any) = null;
    this.orthographicCamera.removeFromParent();
    (this.orthographicCamera as any) = null;
    (this.currentCamera as any) = null;
    this.cameraControls?.dispose();
    (this.cameraControls as any) = null;
  }
  get() {
    return this.currentCamera;
  }
  update(delta: number): void {
    if (!this.enabled) return;
    this.perspectiveCamera.updateProjectionMatrix();
    this.orthographicCamera.updateProjectionMatrix();
    this.cameraControls.update(delta * 5);
  }
  resize(size?: THREE.Vector2 | undefined) {
    if (!size) return;
    this.size = size.clone();
    const aspect = size.x / size.y;
    this.perspectiveCamera.aspect = aspect;
    this.perspectiveCamera.updateProjectionMatrix();
    this.orthographicCamera.left = (-this._frustumSize * aspect) / 2;
    this.orthographicCamera.right = (this._frustumSize * aspect) / 2;
    this.orthographicCamera.top = this._frustumSize / 2;
    this.orthographicCamera.bottom = -this._frustumSize / 2;
    this.orthographicCamera.updateProjectionMatrix();
  }
  getSize() {
    return this.size;
  }

  private init() {
    const {width, height} = this.components.rect;
    this.size.x = width;
    this.size.y = height;
    this.projection = false;
    this.cameraControls = new CameraControls(
      this.currentCamera,
      this.components.canvas
    );
    this.cameraControls.smoothTime = 0.25;
    this.cameraControls.dollyToCursor = true;
    this.cameraControls.dollyDragInverted = true;
    this.cameraControls.infinityDolly = true;
    this.cameraControls.dollySpeed = 2;
    this.cameraControls.setTarget(0, 0, 0);
  }
}
