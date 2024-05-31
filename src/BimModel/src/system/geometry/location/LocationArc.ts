/**
 * @module GeometrySystem
 */
import * as THREE from "three";
import {LineGeometry} from "three/examples/jsm/lines/LineGeometry";
import {Components, MaterialComponent, Disposable} from "@BimModel/src";
import {IBaseLocation, ILocationArc} from "@system/geometry/types";
import {BaseLocation} from "./BaseLocation";
import {Line2} from "three/examples/jsm/lines/Line2";
import {LocationUtils} from "./LocationUtils";
import {
  areEqual,
  defaultToleranceDistance,
  getDirection,
  getProjectPointFrom3Point,
} from "@BimModel/src/utils";

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
    if (!this.segment) return;
    if (visible) {
      this.components.annotationScene.add(this.segment);
    } else {
      this.segment.removeFromParent();
    }
  };

  segment!: Line2;

  get material() {
    return this.components.tools.get(MaterialComponent)?.LocationMaterial;
  }
  /**
   *
   */
  constructor(components: Components, private workPlane: THREE.Plane) {
    super(components);
  }
  /**
   *
   */
  async dispose() {
    this.segment?.geometry.dispose();
    (this.segment!.geometry as any) = null;
    this.segment?.removeFromParent();
    (this.segment as any) = null;
    (this.location as any) = null;
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
        numberSegment: LocationArc.defaultSegment,
      };
    this.location.center.copy(center);
    this.location.start!.copy(start);
    this.location.end!.copy(end);
    this.location.radius = radius;
    this.initSegment();
    this.segment.geometry.setPositions([
      start.x,
      start.y,
      start.z,
      end.x,
      end.y,
      end.z,
    ]);
    if (this.onChange) this.onChange(this.location);
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
    this.location.numberSegment = position.length / 3;
    if (sameSide) {
      this.location.start = end.clone();
      this.location.end = start.clone();
    } else {
      this.location.start = start.clone();
      this.location.end = end.clone();
    }
    this.initSegment();
    this.segment.geometry.dispose();
    (this.segment.geometry as any) = null;
    this.segment.geometry = new LineGeometry();
    this.segment.geometry.setPositions(position);
    this.segment.geometry.setColors(
      LocationUtils.getColorArray(
        this.location.numberSegment,
        LocationUtils.colorBaseLine
      )
    );
    this.segment.computeLineDistances();
  }
  updateCircle(center: THREE.Vector3, movingPoint: THREE.Vector3) {
    const radius = center.distanceTo(movingPoint);
    const dir = getDirection(center, movingPoint);
    this.initLocation(center, radius);
    this.location.center.copy(center);
    this.location.radius = radius;
    this.location.start = movingPoint.clone();
    this.location.end = center.clone().add(dir.multiplyScalar(-radius));
    this.initSegment();
    this.segment.geometry.setPositions(
      LocationUtils.getPointsCircle(
        this.location,
        this.workPlane,
        movingPoint,
        true
      )
    );
    if (this.onChange) this.onChange(this.location);
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
    if (!this.segment)
      this.segment = LocationUtils.createLocationCircle(
        this.material,
        this.location,
        this.workPlane
      );
  }
}
