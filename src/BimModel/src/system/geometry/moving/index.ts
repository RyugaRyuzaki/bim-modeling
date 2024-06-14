import * as THREE from "three";
import {
  Components,
  Disposable,
  GeometryCSS,
  getDirection,
  lengthUnitSignal,
  MaterialComponent,
} from "@BimModel/src";
import {createLabel, disposeLabel, disposeSegment} from "../location/utils";
import {CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer";
import {LocationUtils} from "../location/LocationUtils";

/**
 *
 */
export class MovingLine implements Disposable {
  private _visible = false;
  set visible(visible: boolean) {
    if (this._visible === visible) return;
    this._visible = visible;
    if (!this.segment || !this.tag) return;
    if (visible) {
      this.segment.add(this.tag);
      this.components.annotationScene.add(this.segment);
    } else {
      this.tag.removeFromParent();
      this.segment.removeFromParent();
    }
  }
  segment!: THREE.Line;
  tag!: CSS2DObject;
  get AngleMaterial() {
    return this.components.tools.get(MaterialComponent)?.AngleMaterial;
  }
  /**
   *
   */
  constructor(private components: Components) {
    this.init();
  }
  async dispose() {
    disposeLabel(this.tag);
    disposeSegment(this.segment);
  }
  private init() {
    this.tag = createLabel(GeometryCSS.tag);
  }
  update(start: THREE.Vector3, end: THREE.Vector3) {
    const mid = new THREE.Vector3().lerpVectors(start, end, 0.5);
    const length = start.distanceTo(end);
    const {factor, symbol, toFixed} = lengthUnitSignal.value;
    this.tag.userData.content.textContent = `${(length * factor).toFixed(
      toFixed
    )} ${symbol}`;
    this.tag.position.copy(mid);
    this.tag.position.copy(mid);
    const position = LocationUtils.getPositionLocationFromPoints([start, end]);
    if (!this.segment)
      this.segment = LocationUtils.createSegment(
        this.AngleMaterial,
        position,
        2
      );
    LocationUtils.updateLineSegmentPosition(position, this.segment);
  }
}
