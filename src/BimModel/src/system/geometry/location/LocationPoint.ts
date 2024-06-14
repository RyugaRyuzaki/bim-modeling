/**
 * @module GeometrySystem
 */
import * as THREE from "three";
import {CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer";

import {Components, Disposable} from "@BimModel/src";
import {
  GeometryCSS,
  IBaseLocation,
  ILocationPoint,
} from "@system/geometry/types";
import {BaseLocation} from "./BaseLocation";
import {createLabel, disposeLabel} from "./utils";
export class LocationPoint
  extends BaseLocation
  implements Disposable, IBaseLocation<ILocationPoint>
{
  /** implements @IBaseLocation */
  location!: ILocationPoint;
  onChange!: (value: ILocationPoint) => void;

  /** abstract @BaseLocation */
  onSelect!: (select: boolean) => void;
  onHover!: (hover: boolean) => void;
  onVisibility = (visible: boolean) => {
    if (!this.point) return;
    if (visible) {
      this.components.annotationScene.add(this.point);
    } else {
      this.point.removeFromParent();
    }
  };
  point!: CSS2DObject;
  /**
   *
   */
  constructor(components: Components, workPlane: THREE.Plane) {
    super(components, workPlane);
    this.point = createLabel(GeometryCSS.snap.endLine);
  }
  async dispose() {
    disposeLabel(this.point);
    (this.point as any) = null;
  }
  update(point: THREE.Vector3) {
    if (!this.location) this.location = {point: point.clone()};
    this.location.point.copy(point);
    this.point.position.copy(point);
  }
  onClone = () => {
    return this;
  };
}
