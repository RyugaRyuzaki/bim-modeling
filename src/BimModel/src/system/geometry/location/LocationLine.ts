/**
 * @module GeometrySystem
 */

import * as THREE from "three";
import {
  Components,
  MaterialComponent,
  Disposable,
  Dimension,
} from "@BimModel/src";
import {
  GeometryCSS,
  IBaseLocation,
  ILocationLine,
} from "@system/geometry/types";
import {BaseLocation} from "./BaseLocation";
import {CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer";
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
    if (!this.segment || !this.startPoint || !this.endPoint) return;
    if (visible) {
      this.segment.add(this.startPoint);
      this.segment.add(this.endPoint);
      this.components.annotationScene.add(this.segment);
    } else {
      this.startPoint.removeFromParent();
      this.endPoint.removeFromParent();
      this.segment.removeFromParent();
    }
  };
  endPoint!: CSS2DObject;
  startPoint!: CSS2DObject;
  segment!: THREE.LineSegments;

  get material() {
    return this.components.tools.get(MaterialComponent)?.LocationMaterial;
  }
  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.startPoint = Dimension.createLabel(GeometryCSS.snap.endLine);
    this.endPoint = Dimension.createLabel(GeometryCSS.snap.endLine);
  }
  async dispose() {
    this.segment?.geometry.dispose();
    (this.segment!.geometry as any) = null;
    this.segment?.removeFromParent();
    (this.segment as any) = null;
    (this.location as any) = null;
    Dimension.disposeLabel(this.startPoint);
    (this.startPoint as any) = null;
    Dimension.disposeLabel(this.endPoint);
    (this.endPoint as any) = null;
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
    this.startPoint.position.copy(start);
    this.endPoint.position.copy(end);
    const position = LocationUtils.getPositionLocationFromPoints([start, end]);
    LocationUtils.updateLineSegmentPosition(position, this.segment);
    if (this.onChange) this.onChange(this.location);
  }
}
