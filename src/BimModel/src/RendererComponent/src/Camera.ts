/**
 * @module CameraComponent
 */
import * as THREE from "three";
import CameraControls from "camera-controls";
import {Disposable, Resizeable, Updateable} from "../../types";
import {Components} from "../../Components";
import {
  defaultCameraFar,
  initOrthographicCamera,
  initPerspectiveCamera,
} from "../../utils";
import {CubeMapComponent} from "@BimModel/src/CubeMapComponent";

CameraControls.install({
  THREE,
});
/**
 *
 */
export class Camera implements Disposable, Resizeable, Updateable {
  protected readonly _frustumSize = 100;

  enabled = false;

  private perspectiveCamera!: THREE.PerspectiveCamera;

  private orthographicCamera!: THREE.OrthographicCamera;

  currentCamera!: THREE.PerspectiveCamera | THREE.OrthographicCamera;

  cameraControls!: CameraControls;

  size: THREE.Vector2 = new THREE.Vector2();

  canUpdate = false;

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

  private state: {position: THREE.Vector3; target: THREE.Vector3} = {
    position: new THREE.Vector3(),
    target: new THREE.Vector3(),
  };
  /**
   *
   * @param components
   */
  constructor(private components: Components) {
    this.init();
  }
  /**
   *
   */
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
  /**
   *
   * @returns
   */
  get() {
    return this.currentCamera;
  }
  /**
   *
   * @param delta
   * @returns
   */
  update(delta: number): void {
    if (!this.enabled) return;

    this.perspectiveCamera.updateProjectionMatrix();

    this.orthographicCamera.updateProjectionMatrix();

    this.canUpdate = this.cameraControls.update(delta * 2);
  }
  /**
   *
   * @param size
   * @returns
   */
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
  /**
   *
   * @returns
   */
  getSize() {
    return this.size;
  }
  /**
   *
   * @param position
   * @param target
   */
  setLookAt(position: THREE.Vector3, target: THREE.Vector3) {
    const box = this.components.tools.get(CubeMapComponent).box;

    this.cameraControls.zoomTo(1);

    this.cameraControls.setLookAt(
      position.x,
      position.y,
      position.z,
      target.x,
      target.y,
      target.z,
      true
    );
  }
  /**
   *
   */
  saveState() {
    const {position, target} = this.state;

    this.cameraControls.getPosition(position);

    this.cameraControls.getTarget(target);
  }
  /**
   *
   * @returns
   */
  resetState() {
    if (!this.cameraControls) return;

    this.currentCamera.far = defaultCameraFar;

    this.currentCamera.near = -defaultCameraFar;
  }
  /**
   *
   */
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

    const {position, target} = this.state;

    this.cameraControls.getPosition(position);

    this.cameraControls.getTarget(target);

    this.cameraControls.mouseButtons.left = 0;

    this.cameraControls.mouseButtons.middle = 2;
  }
}
