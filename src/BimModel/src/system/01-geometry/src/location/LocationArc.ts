/**
 * @module GeometrySystem
 */
import * as THREE from "three";
import {Components, MaterialComponent, Disposable} from "@BimModel/src";
import {IBaseLocation, ILocationArc} from "@system/01-geometry/types";
import {BaseLocation} from "./BaseLocation";
import {Line2} from "three/examples/jsm/lines/Line2";
import {LocationUtils} from "./LocationUtils";
import {getProjectPointFrom3Point} from "@BimModel/src/utils";

export class LocationArc
  extends BaseLocation
  implements Disposable, IBaseLocation<ILocationArc>
{
  static readonly defaultSegment = 24;
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
    if (!this.segment)
      this.segment = LocationUtils.createLocationArc(
        this.material,
        this.location
      );
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
    const pro = getProjectPointFrom3Point(start, end, movingPoint);
    const disPro = movingPoint.distanceTo(pro);
    const tempRadius = start.distanceTo(end);
    if (disPro <= tempRadius * 0.2) return this.update2PointsArc(start, end);
  }
  updateCircle(center: THREE.Vector3, movingPoint: THREE.Vector3) {
    const radius = center.distanceTo(movingPoint);
    if (!this.location)
      this.location = {
        center: center.clone(),
        radius,
        numberSegment: LocationArc.defaultSegment,
      };
    this.location.center.copy(center);
    this.location.radius = radius;
    if (!this.segment)
      this.segment = LocationUtils.createLocationCircle(
        this.material,
        this.location,
        this.workPlane
      );
    this.segment.geometry.setPositions(
      LocationUtils.getPointsCircle(this.location, this.workPlane)
    );
    if (this.onChange) this.onChange(this.location);
  }
}
