/**
 * @module GridSystem
 */

import * as THREE from "three";
import {
  Annotation,
  Components,
  CubeMapComponent,
  GridSystem,
  MaterialComponent,
} from "@BimModel/src";
import {Disposable} from "@BimModel/src/types";

import {IGrid} from "../types";
import {disposeSegment} from "@BimModel/src/system/geometry/location/utils";
import {LocationUtils} from "@BimModel/src/system/geometry/location/LocationUtils";
import {ILevel, IView} from "@BimModel/src/LevelSystem/types";
import {Elevation} from "@BimModel/src/LevelSystem/src";

/**
 *
 */
export class Grid implements Disposable {
  private static readonly radius = 40;
  get boundingBox() {
    return this.components.tools.get(CubeMapComponent).box;
  }
  get elevation() {
    return this.components.tools.get(GridSystem).elevation;
  }
  private _select = false;
  set select(select: boolean) {
    if (!this._select === select) return;
    this._select = select;
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
  get visible() {
    return this._visible;
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
  endPoint!: Annotation;
  startPoint!: Annotation;
  segment!: THREE.Line;

  get line() {
    const {axis, coordinate, length} = this.gridItem;
    const start = new THREE.Vector3();
    const end = new THREE.Vector3();
    if (axis === "X") {
      start.x = -length;
      end.x = length;
      start.z = coordinate;
      end.z = coordinate;
    } else {
      start.z = -length;
      end.z = length;
      start.x = coordinate;
      end.x = coordinate;
    }
    return {start, end};
  }
  /**
   *
   */
  constructor(private components: Components, public gridItem: IGrid) {
    this.init();
  }
  async dispose() {
    this.startPoint?.dispose();
    (this.startPoint as any) = null;
    this.endPoint?.dispose();
    (this.endPoint as any) = null;
    disposeSegment(this.segment);
  }
  private init() {
    const {name} = this.gridItem;
    const {start, end} = this.line;
    const delta = Grid.radius / 2;
    this.startPoint = new Annotation(
      start,
      delta,
      delta,
      Grid.radius,
      Grid.radius
    );
    Annotation.initGridAnnotation(this.startPoint.svg, Grid.radius);
    this.endPoint = new Annotation(end, delta, delta, Grid.radius, Grid.radius);
    Annotation.initGridAnnotation(this.endPoint.svg, Grid.radius);
    this.startPoint.nameSignal.value = name;
    this.startPoint.onChangeName = this.onChangeName;
    this.endPoint.nameSignal.value = name;
    this.endPoint.onChangeName = this.onChangeName;
    const position = LocationUtils.getPositionLocationFromPoints([start, end]);
    this.segment = LocationUtils.createSegment(this.GridMaterial, position, 2);
  }

  onChangeName = (value: string) => {
    this.startPoint.nameSignal.value = value;
    this.endPoint.nameSignal.value = value;
  };
  onViewChange(view: IView, elevation: Elevation | null | undefined) {
    if (view.viewType === "3D") {
      this.visible = false;
      return;
    }
    if (!this.elevation) return;
    const {start, end} = this.line;
    if (view.viewType === "Plan" && view.level) {
      this.visible = true;
      start.y = view.level.elevation;
      end.y = view.level.elevation;
    } else if (view.viewType === "Elevation") {
      const {elevationType} = view;
      if (!elevation || !elevationType) {
        this.visible = false;
      } else {
        start.y = this.elevation.bottom;
        end.y = this.elevation.top;
        const {coordinate} = this.gridItem;
        if (elevationType === "South" || elevationType === "North") {
          this.visible = this.gridItem.axis === "Y";
          start.x = coordinate;
          end.x = coordinate;
        } else {
          this.visible = this.gridItem.axis === "X";
          start.z = coordinate;
          end.z = coordinate;
        }
      }
    }
    this.update(start, end);
  }
  onUpdateLevel(bottom: ILevel, top: ILevel) {
    const {start, end} = this.line;
    start.y = bottom.elevation;
    end.y = top.elevation;
    this.update(start, end);
  }
  private update(start: THREE.Vector3, end: THREE.Vector3) {
    this.startPoint.point.copy(start);
    this.endPoint.point.copy(end);
    const position = LocationUtils.getPositionLocationFromPoints([start, end]);
    LocationUtils.updateLineSegmentPosition(position, this.segment);
  }
}
