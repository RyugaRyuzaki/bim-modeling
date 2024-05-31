/**
 * @module GeometrySystem
 */

import * as THREE from "three";
import {Components, MaterialComponent, Disposable} from "@BimModel/src";
import {IBaseLocation, ILocationLine} from "@system/geometry/types";
import {BaseLocation} from "./BaseLocation";
import {Line2} from "three/examples/jsm/lines/Line2";
import {LocationUtils} from "./LocationUtils";
export class LocationLine
  extends BaseLocation
  implements Disposable, IBaseLocation<ILocationLine>
{
  /** implements @IBaseLocation */
  location!: ILocationLine;
  onChange!: (value: ILocationLine) => void;

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
  constructor(components: Components) {
    super(components);
  }
  async dispose() {
    this.segment?.geometry.dispose();
    (this.segment!.geometry as any) = null;
    this.segment?.removeFromParent();
    (this.segment as any) = null;
    (this.location as any) = null;
  }
  update(start: THREE.Vector3, end: THREE.Vector3) {
    if (!this.location)
      this.location = {start: start.clone(), end: end.clone()};
    this.location.start.copy(start);
    this.location.end.copy(end);
    if (!this.segment)
      this.segment = LocationUtils.createLocationLine(
        this.material,
        this.location
      );
    this.segment.geometry.setPositions(
      LocationUtils.getPositionLocationFromPoints([start, end])
    );
    if (this.onChange) this.onChange(this.location);
  }
}
