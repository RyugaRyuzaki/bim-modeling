/**
 * @module GeometrySystem
 */
import * as THREE from "three";
import {CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer";
import {Components, Disposable, lengthUnitSignal} from "@BimModel/src";
import {dimStyle, GeometryCSS, IBaseLocation} from "@system/geometry/types";
import {BaseLocation} from "./BaseLocation";
import {LocationUtils} from "./LocationUtils";
import {
  areEqual,
  defaultToleranceDistance,
  getDirection,
  getProjectPointFrom3Point,
} from "@BimModel/src/utils";
import {createLabel, disposeLabel, disposeSegment} from "./utils";
import {
  createDimensionAngleContainer,
  createDimensionRadiusContainer,
} from "./Components";
import {ILocationArc} from "clay";

/**
 *
 */
export class LocationArc
  extends BaseLocation
  implements Disposable, IBaseLocation<ILocationArc>
{
  static readonly defaultSegment = 48;
  static readonly tempVector = new THREE.Vector3();
  /** implements @IBaseLocation */
  location!: ILocationArc;
  onChange!: (value: ILocationArc) => void;

  /** abstract @BaseLocation */
  onSelect!: (select: boolean) => void;
  onHover!: (hover: boolean) => void;
  onVisibility = (visible: boolean) => {
    if (!this.segment || !this.radiusTag || !this.radiusDimension) return;
    if (visible) {
      this.segment.add(this.startPoint);
      this.segment.add(this.endPoint);
      this.segment.add(this.center);
      this.components.annotationScene.add(this.segment);
      this.radiusDimension.add(this.radiusTag);
      this.components.annotationScene.add(this.radiusDimension);
    } else {
      this.startPoint.removeFromParent();
      this.endPoint.removeFromParent();
      this.center.removeFromParent();
      this.segment.removeFromParent();
      this.radiusTag.removeFromParent();
      this.radiusDimension.removeFromParent();
    }
  };

  private _visibleAngle = false;
  set visibleAngle(visibleAngle: boolean) {
    if (!this.angleDimension || !this.angleTag) return;
    if (this._visibleAngle === visibleAngle) return;
    this._visibleAngle = visibleAngle;
    if (visibleAngle) {
      this.angleDimension.add(this.angleTag);
      this.components.annotationScene.add(this.angleDimension);
    } else {
      this.angleTag.removeFromParent();
      this.angleDimension.removeFromParent();
    }
  }
  endPoint!: CSS2DObject;
  startPoint!: CSS2DObject;
  center!: CSS2DObject;
  segment!: THREE.Line;

  radiusDomElement!: HTMLDivElement;
  radiusTag!: CSS2DObject;
  radiusDimension!: THREE.Line;

  angleDomElement!: HTMLDivElement;
  angleTag!: CSS2DObject;
  angleDimension!: THREE.Line;

  /**
   *
   */
  constructor(components: Components, workPlane: THREE.Plane) {
    super(components, workPlane);
    this.init();
  }
  /**
   *
   */
  async dispose() {
    (this.location as any) = null;
    this.radiusDomElement?.remove();
    (this.radiusDomElement as any) = null;
    this.angleDomElement?.remove();
    (this.angleDomElement as any) = null;
    disposeSegment(this.segment);
    disposeSegment(this.radiusDimension);
    disposeSegment(this.angleDimension);
    disposeLabel(this.startPoint);
    disposeLabel(this.endPoint);
    disposeLabel(this.center);
    disposeLabel(this.radiusTag);
    disposeLabel(this.angleTag);
  }
  private init() {
    this.startPoint = createLabel(GeometryCSS.snap.endLine);
    this.endPoint = createLabel(GeometryCSS.snap.endLine);
    this.center = createLabel(GeometryCSS.snap.endLine);

    this.radiusDomElement = createDimensionRadiusContainer(this);
    this.radiusTag = new CSS2DObject(this.radiusDomElement);

    this.angleDomElement = createDimensionAngleContainer(this);
    this.angleTag = new CSS2DObject(this.angleDomElement);
  }

  update2PointsArc(start: THREE.Vector3, end: THREE.Vector3) {
    const radius = start.distanceTo(end) / 2;
    const center = LocationArc.tempVector.lerpVectors(end, start, 0.5);
    if (!this.location)
      this.location = {
        center,
        start: start.clone(),
        end: end.clone(),
        radius,
        angle: 180,
        numberSegment: LocationArc.defaultSegment,
      };
    this.location.center.copy(center);
    this.location.start!.copy(start);
    this.location.end!.copy(end);
    this.location.radius = radius;
    this.startPoint.position.copy(this.location.start!);
    this.endPoint.position.copy(this.location.end!);
    this.center.position.copy(this.location.center);
    this.initSegment();
    const position = [start.x, start.y, start.z, end.x, end.y, end.z];
    LocationUtils.updateLineSegmentPosition(position, this.segment);
    this.updateLine2PointsArc();
  }
  private updateLine2PointsArc() {
    if (!this.radiusTag || !this.angleTag || !this.location) return;
    const {start, end, angle} = this.location;
    if (!start || !end || !angle) return;

    const uVector = getDirection(start, end);
    const vVector = LocationArc.tempVector
      .crossVectors(this.workPlane.normal, uVector)
      .normalize();
    const newStart = start
      .clone()
      .add(vVector.clone().multiplyScalar(dimStyle.extend));
    const newEnd = end
      .clone()
      .add(vVector.clone().multiplyScalar(dimStyle.extend));
    const mid = new THREE.Vector3().lerpVectors(newStart, newEnd, 0.5);
    this.radiusTag.position.copy(mid);
    const position: number[] = LocationUtils.getPositionLocationFromPoints([
      start,
      newStart,
      newStart,
      newEnd,
      newEnd,
      end,
    ]);
    if (!this.radiusDimension)
      this.radiusDimension = LocationUtils.createSegment(
        this.DimensionMaterial,
        position,
        4
      );
    LocationUtils.updateLineSegmentPosition(position, this.radiusDimension);
    const {factor, toFixed} = lengthUnitSignal.value;
    if (this.onChangeRadiusDomElement)
      this.onChangeRadiusDomElement(
        `${(start.distanceTo(end) * factor).toFixed(toFixed)}`
      );
  }

  update3PointsArc(
    start: THREE.Vector3,
    end: THREE.Vector3,
    movingPoint: THREE.Vector3
  ) {
    // get project from moving to line (start-end)
    const pro = getProjectPointFrom3Point(start, end, movingPoint);
    const dis = start.distanceTo(end);
    const disPro = movingPoint.distanceTo(pro);
    const uVector = getDirection(start, end);
    const vVector = new THREE.Vector3()
      .crossVectors(this.workPlane.normal, uVector)
      .normalize();

    if (disPro <= defaultToleranceDistance)
      return this.update2PointsArc(start, end);
    // find direction
    const dirPro = getDirection(movingPoint, pro);
    const sameSide = areEqual(
      dirPro.angleTo(vVector),
      0.0,
      defaultToleranceDistance
    );
    // find middle
    const mid = new THREE.Vector3().lerpVectors(start, end, 0.5);
    const d2 = Math.sqrt(disPro * disPro + (dis * dis) / 4);
    const d3 = (d2 * d2) / (2 * disPro) - disPro;
    let center: THREE.Vector3, angleArc: number;
    if (disPro > dis / 2) {
      center = mid.clone().add(dirPro.clone().multiplyScalar(-Math.abs(d3)));
      angleArc = 2 * Math.PI - 2 * Math.atan((dis * 0.5) / Math.abs(d3));
    } else {
      center = mid.clone().add(dirPro.clone().multiplyScalar(Math.abs(d3)));
      angleArc = 2 * Math.atan((dis * 0.5) / Math.abs(d3));
    }
    const pS = sameSide ? start : end;
    const radius = center.distanceTo(pS);
    const position = LocationUtils.getPointsArcFromAngle(
      radius,
      center,
      pS,
      this.workPlane.normal,
      angleArc,
      LocationArc.defaultSegment
    );
    this.initLocation(center, radius);
    this.location.center.copy(center);
    this.location.radius = radius;
    this.location.angle = THREE.MathUtils.radToDeg(angleArc);
    this.location.numberSegment = position.length / 3;
    if (sameSide) {
      this.location.start = end.clone();
      this.location.end = start.clone();
    } else {
      this.location.start = start.clone();
      this.location.end = end.clone();
    }
    this.startPoint.position.copy(this.location.start);
    this.endPoint.position.copy(this.location.end);
    this.center.position.copy(this.location.center);
    this.initSegment();
    LocationUtils.updateLineSegmentPosition(position, this.segment);
    this.updateLine3PointsArc(movingPoint);
  }
  private updateLine3PointsArc(movingPoint: THREE.Vector3) {
    if (!this.radiusTag || !this.angleTag || !this.location) return;
    const {start, end, angle, center, radius} = this.location;
    if (!start || !end || !angle) return;

    const dir = getDirection(center, movingPoint);
    const newMoving = center.clone().add(dir.multiplyScalar(radius));
    const mid = new THREE.Vector3().lerpVectors(center, newMoving, 0.5);
    this.radiusTag.position.copy(mid);
    const position: number[] = LocationUtils.getPositionLocationFromPoints([
      center,
      newMoving,
    ]);
    if (!this.radiusDimension)
      this.radiusDimension = LocationUtils.createSegment(
        this.DimensionMaterial,
        position,
        4
      );
    LocationUtils.updateLineSegmentPosition(position, this.radiusDimension);
    const {factor, toFixed} = lengthUnitSignal.value;
    if (this.onChangeRadiusDomElement)
      this.onChangeRadiusDomElement(`${(radius * factor).toFixed(toFixed)}`);

    const midAngle = new THREE.Vector3().lerpVectors(center, newMoving, -0.3);
    this.angleTag.position.copy(midAngle);

    if (!this.angleDimension) {
      this.angleDimension = LocationUtils.createLocationCircle(
        this.AngleMaterial,
        this.location,
        this.workPlane
      );
    }
    const positionAngle: number[] = LocationUtils.getPositionLocationFromPoints(
      [start, center, center, end]
    );
    LocationUtils.updateLineSegmentPosition(positionAngle, this.angleDimension);
    if (this.onChangeAngleDomElement)
      this.onChangeAngleDomElement(`${angle.toFixed(0)}`);
  }
  updateCircle(center: THREE.Vector3, movingPoint: THREE.Vector3) {
    const radius = center.distanceTo(movingPoint);
    const dir = getDirection(center, movingPoint);
    this.initLocation(center, radius);
    this.location.center.copy(center);
    this.location.radius = radius;
    this.location.start = movingPoint.clone();
    this.location.end = center.clone().add(dir.multiplyScalar(-radius));
    this.startPoint.position.copy(this.location.start);
    this.endPoint.position.copy(this.location.end);
    this.center.position.copy(this.location.center);
    this.initSegment();
    const position = LocationUtils.getPointsCircle(
      this.location,
      this.workPlane,
      movingPoint,
      true
    );
    LocationUtils.updateLineSegmentPosition(position, this.segment);
  }

  private initLocation(center: THREE.Vector3, radius: number) {
    if (!this.location)
      this.location = {
        center: center.clone(),
        radius,
        numberSegment: LocationArc.defaultSegment,
      };
  }
  private initSegment() {
    if (!this.segment) {
      this.segment = LocationUtils.createLocationCircle(
        this.LocationMaterial,
        this.location,
        this.workPlane
      );
    }
  }

  onChangeRadius!: (radius: number) => void;
  onChangeRadiusDomElement!: (radius: string) => void;
  updateRadius(_radius: number) {}
  onChangeAngle!: (angle: number) => void;
  onChangeAngleDomElement!: (angle: string) => void;
  updateAngle(_angle: number) {}
  onClone = () => {
    return this;
  };
}
