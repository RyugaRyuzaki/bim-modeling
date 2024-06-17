import * as THREE from "three";
import {CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer";
import {
  Components,
  Disposable,
  CubeMapComponent,
  MaterialComponent,
  createSVG,
  createRectSVG,
  setUpPath,
  strokeStyle,
  selectViewSignal,
  Annotation,
} from "@BimModel/src";
import {IElevation, ILevel, IView} from "../../types";
import {disposeSegment} from "@BimModel/src/system/geometry/location/utils";
import {LocationUtils} from "@BimModel/src/system/geometry/location/LocationUtils";
export class Level implements Disposable {
  private static readonly radius = 60;

  get boundingBox() {
    return this.components.tools.get(CubeMapComponent).box;
  }
  get MaterialComponent() {
    return this.components.tools.get(MaterialComponent);
  }
  get GridMaterial(): THREE.LineDashedMaterial {
    return this.MaterialComponent.GridMaterial;
  }
  get GridOutlineMaterial(): THREE.LineDashedMaterial {
    return this.MaterialComponent.GridOutlineMaterial;
  }
  private _visible = false;
  set visible(visible: boolean) {
    if (!this.startPoint || !this.endPoint || !this.segment) return;
    if (this._visible === visible) return;
    this._visible = visible;
    if (visible) {
      this.segment.add(this.startPoint.label);
      this.segment.add(this.endPoint.label);
      this.components.annotationScene.add(this.segment);
    } else {
      this.startPoint.label.removeFromParent();
      this.endPoint.label.removeFromParent();
      this.segment.removeFromParent();
    }
  }
  set setupEvent(_enabled: boolean) {}
  endPoint!: Annotation;
  startPoint!: Annotation;
  segment!: THREE.Line;
  get elevation() {
    const {max, min} = this.boundingBox;
    const maxX = Math.max(Math.abs(max.x), Math.abs(min.x));
    const maxZ = Math.max(Math.abs(max.z), Math.abs(min.z));
    const pS = new THREE.Vector3(0, this.level.elevation, maxZ);
    const pN = new THREE.Vector3(0, this.level.elevation, -maxZ);
    const pW = new THREE.Vector3(-maxX, this.level.elevation, 0);
    const pE = new THREE.Vector3(maxX, this.level.elevation, 0);
    return {pS, pN, pW, pE};
  }
  set elevationType(elevationType: IElevation | undefined) {
    if (elevationType === undefined || !this.boundingBox) return;
    const {pS, pN, pW, pE} = this.elevation;
    let start: THREE.Vector3;
    let end: THREE.Vector3;
    switch (elevationType) {
      case "South":
        start = pW;
        end = pE;
        break;
      case "North":
        start = pE;
        end = pW;
        break;
      case "West":
        start = pN;
        end = pS;
        break;
      case "East":
        start = pS;
        end = pN;
        break;
    }
    if (start && end) this.update(start, end);
  }
  initialized = false;
  /**
   *
   */
  constructor(private components: Components, public level: ILevel) {}
  async dispose() {
    this.initialized = false;
    this.setupEvent = false;
    this.startPoint?.dispose();
    (this.startPoint as any) = null;
    this.endPoint?.dispose();
    (this.endPoint as any) = null;
    disposeSegment(this.segment);
  }
  onChangeName = (value: string) => {
    this.startPoint.nameSignal.value = value;
    this.endPoint.nameSignal.value = value;
  };

  private update(start: THREE.Vector3, end: THREE.Vector3) {
    const {name} = this.level;
    if (!this.initialized) {
      this.startPoint = new Annotation(
        start,
        Level.radius / 6 + 10,
        Level.radius / 2,
        Level.radius,
        Level.radius
      );
      Annotation.initLevelAnnotation(this.startPoint.svg, Level.radius);
      this.startPoint.container.style.top = `${-Level.radius / 2}px`;
      this.startPoint.container.style.left = `${Level.radius / 2}px`;
      this.endPoint = new Annotation(
        end,
        10,
        Level.radius / 2,
        Level.radius,
        Level.radius
      );
      Annotation.initLevelAnnotation(this.endPoint.svg, Level.radius, false);

      this.endPoint.container.style.top = `${-Level.radius / 2}px`;
      this.endPoint.container.style.left = `${-Level.radius / 2}px`;
      this.startPoint.nameSignal.value = name;
      this.startPoint.onChangeName = this.onChangeName;
      this.endPoint.nameSignal.value = name;
      this.endPoint.onChangeName = this.onChangeName;
      this.setupEvent = true;
      this.initialized = true;
    }
    this.startPoint.point.copy(start);
    this.endPoint.point.copy(end);
    const position = LocationUtils.getPositionLocationFromPoints([start, end]);
    if (!this.segment)
      this.segment = LocationUtils.createSegment(
        this.GridMaterial,
        position,
        2
      );
    LocationUtils.updateLineSegmentPosition(position, this.segment);
  }
}
