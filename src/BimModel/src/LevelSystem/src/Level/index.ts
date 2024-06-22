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
import {LevelAnnotation} from "./LevelAnnotation";
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
    if (!this.point || !this.segment) return;
    if (this._visible === visible) return;
    this._visible = visible;
    if (visible) {
      this.segment.add(this.point.label);
      this.components.annotationScene.add(this.segment);
    } else {
      this.point.label.removeFromParent();
      this.segment.removeFromParent();
    }
  }
  point!: LevelAnnotation;
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
  private initialized = false;
  /**
   *
   */
  constructor(private components: Components, public level: ILevel) {}
  async dispose() {
    this.initialized = false;
    this.point?.dispose();
    (this.point as any) = null;
    disposeSegment(this.segment);
  }
  onChangeLevel = (value: number) => {
    if (!this.segment || !this.segment.geometry.attributes.position) return;
    const corePositions = this.segment.geometry.attributes.position.array;
    corePositions[1] = value;
    corePositions[4] = value;
    this.segment.computeLineDistances();
    this.segment.geometry.attributes.position.needsUpdate = true;
    this.point.point.y = value;
  };
  private update(start: THREE.Vector3, end: THREE.Vector3) {
    if (!this.initialized) {
      this.point = new LevelAnnotation(this.level, end);
      this.point.onChangeLevel = this.onChangeLevel;
      this.initialized = true;
    }
    this.point.point.copy(end);
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
