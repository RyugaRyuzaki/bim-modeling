/**
 * @module GeometrySystem
 */

import * as THREE from "three";
import {
  Components,
  Disposable,
  getDirection,
  lengthUnitSignal,
} from "@BimModel/src";
import {dimStyle, GeometryCSS, IBaseLocation} from "@system/geometry/types";
import {BaseLocation} from "./BaseLocation";
import {CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer";
import {LocationUtils} from "./LocationUtils";
import {createDimensionLocationLineContainer} from "./Components";
import {effect} from "@preact/signals-react";
import {createLabel, disposeLabel} from "./utils";
import {disposeSegment} from "./utils";
import {ILocationLine} from "clay";
/**
 *
 */
export class LocationLine
  extends BaseLocation
  implements Disposable, IBaseLocation<ILocationLine>
{
  static readonly tempVector = new THREE.Vector3();
  /** implements @IBaseLocation */
  location!: ILocationLine;
  onChange!: (value: ILocationLine) => void;

  /** abstract @BaseLocation */
  onSelect!: (select: boolean) => void;
  onHover!: (hover: boolean) => void;
  onVisibility = (visible: boolean) => {
    if (
      !this.segment ||
      !this.startPoint ||
      !this.endPoint ||
      !this.domElement ||
      !this.tag ||
      !this.dimension
    )
      return;
    if (visible) {
      this.segment.add(this.startPoint);
      this.segment.add(this.endPoint);
      this.dimension.add(this.tag);
      this.components.annotationScene.add(this.dimension);
      this.components.annotationScene.add(this.segment);
    } else {
      this.startPoint.removeFromParent();
      this.endPoint.removeFromParent();
      this.segment.removeFromParent();
      this.tag.removeFromParent();
      this.dimension.removeFromParent();
    }
  };
  endPoint!: CSS2DObject;
  startPoint!: CSS2DObject;
  segment!: THREE.Line;

  domElement!: HTMLDivElement;
  tag!: CSS2DObject;
  dimension!: THREE.Line;

  private _length = 0;
  set length(length: number) {
    this._length = length;
    if (!this.tag || !this.domElement) return;
    const {factor, toFixed} = lengthUnitSignal.value;
    if (this.onChangeLengthDomElement)
      this.onChangeLengthDomElement(
        `${(this.length * factor).toFixed(toFixed)}`
      );
  }
  get length() {
    return this._length;
  }

  /**
   *
   */
  constructor(components: Components, workPlane: THREE.Plane) {
    super(components, workPlane);
    this.init();
    effect(() => {
      const {factor, toFixed} = lengthUnitSignal.value;
      if (this.onChangeLengthDomElement)
        this.onChangeLengthDomElement(
          `${(this.length * factor).toFixed(toFixed)}`
        );
    });
  }
  async dispose() {
    (this.location as any) = null;
    this.domElement?.remove();
    (this.domElement as any) = null;
    disposeSegment(this.segment);
    disposeSegment(this.dimension);
    disposeLabel(this.startPoint);
    disposeLabel(this.endPoint);
    disposeLabel(this.tag);
  }
  private init() {
    this.startPoint = createLabel(GeometryCSS.snap.endLine);
    this.endPoint = createLabel(GeometryCSS.snap.endLine);
    this.domElement = createDimensionLocationLineContainer(this);
    this.tag = new CSS2DObject(this.domElement);
  }
  update(start: THREE.Vector3, end: THREE.Vector3) {
    if (!this.location)
      this.location = {start: start.clone(), end: end.clone()};
    this.location.start.copy(start);
    this.location.end.copy(end);
    if (!this.segment)
      this.segment = LocationUtils.createLocationLine(
        this.LocationMaterial,
        this.location
      );
    this.startPoint.position.copy(start);
    this.endPoint.position.copy(end);
    const position = LocationUtils.getPositionLocationFromPoints([start, end]);
    LocationUtils.updateLineSegmentPosition(position, this.segment);
    this.updateLine();
  }
  updateLine() {
    if (!this.tag || !this.location) return;
    const {start, end} = this.location;
    this.length = start.distanceTo(end);

    const uVector = getDirection(start, end);
    const vVector = LocationLine.tempVector
      .crossVectors(this.workPlane.normal, uVector)
      .normalize();
    const newStart = start
      .clone()
      .add(vVector.clone().multiplyScalar(dimStyle.extend));
    const newEnd = end
      .clone()
      .add(vVector.clone().multiplyScalar(dimStyle.extend));
    const mid = new THREE.Vector3().lerpVectors(newStart, newEnd, 0.5);
    this.tag.position.copy(mid);
    const position: number[] = LocationUtils.getPositionLocationFromPoints([
      start,
      newStart,
      newStart,
      newEnd,
      newEnd,
      end,
    ]);
    if (!this.dimension)
      this.dimension = LocationUtils.createSegment(
        this.DimensionMaterial,
        position,
        4
      );
    LocationUtils.updateLineSegmentPosition(position, this.dimension);
  }
  onChangeLength!: (length: number) => void;
  onChangeLengthDomElement!: (length: string) => void;
  updateMove(origin: THREE.Vector3, movingPoint: THREE.Vector3) {
    const dir = getDirection(origin, movingPoint);
    const dis = origin.distanceTo(movingPoint);
    const start = this.location.start
      .clone()
      .add(dir.clone().multiplyScalar(dis));
    const end = this.location.end.clone().add(dir.clone().multiplyScalar(dis));
    this.update(start, end);
  }
  updateLength(length: number) {
    if (!this.location) return;
    const {factor} = lengthUnitSignal.value;
    const value = length / factor;
    const dir = getDirection(this.location.start, this.location.end);
    const end = this.location.start.clone().add(dir.multiplyScalar(value));
    this.update(this.location.start, end);
  }
  onClone = () => {
    const location = new LocationLine(this.components, this.workPlane);
    location.update(this.location.start, this.location.end);
    return location;
  };
}
