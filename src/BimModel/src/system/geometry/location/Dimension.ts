/**
 * @module GeometrySystem
 */

import * as THREE from "three";
import {
  Components,
  MaterialComponent,
  Disposable,
  lengthUnitSignal,
} from "@BimModel/src";
import {CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer";
import {dimStyle, GeometryCSS} from "../types";
import {LocationUtils} from "./LocationUtils";
import {BaseLocation} from "./BaseLocation";
import {getDirection} from "@BimModel/src/utils";
import {effect} from "@preact/signals-react";
export class Dimension extends BaseLocation implements Disposable {
  static readonly tempVector = new THREE.Vector3();

  /** abstract @BaseLocation */
  onSelect!: (select: boolean) => void;
  onHover!: (hover: boolean) => void;
  onVisibility = (visible: boolean) => {
    if (!this.segment || !this.tag) return;
    if (visible) {
      this.segment.add(this.tag);
      this.components.annotationScene.add(this.segment);
    } else {
      this.tag.removeFromParent();
      this.segment.removeFromParent();
    }
  };
  tag!: CSS2DObject;
  segment!: THREE.LineSegments;
  get material() {
    return this.components.tools.get(MaterialComponent)?.DimensionMaterial;
  }
  length = 0;
  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.tag = Dimension.createLabel(GeometryCSS.tag);
    effect(() => {
      const {factor, symbol, toFixed} = lengthUnitSignal.value;
      if (!this.tag || !this.tag.userData.content) return;
      this.tag.userData.content.textContent = `${(this.length * factor).toFixed(
        toFixed
      )} ${symbol}`;
    });
  }
  async dispose() {
    Dimension.disposeSegment(this.segment);
    (this.segment as any) = null;
    Dimension.disposeLabel(this.tag);
    (this.tag as any) = null;
  }

  updateLine(start: THREE.Vector3, end: THREE.Vector3, workPlane: THREE.Plane) {
    if (!this.tag) return;
    this.length = start.distanceTo(end);
    const {factor, symbol, toFixed} = lengthUnitSignal.value;
    this.tag.userData.content.textContent = `${(this.length * factor).toFixed(
      toFixed
    )} ${symbol}`;

    const uVector = getDirection(start, end);
    const vVector = Dimension.tempVector
      .crossVectors(workPlane.normal, uVector)
      .normalize();
    const newStart = start
      .clone()
      .add(vVector.clone().multiplyScalar(dimStyle.extend));
    const newEnd = end
      .clone()
      .add(vVector.clone().multiplyScalar(dimStyle.extend));
    const mid = new THREE.Vector3().lerpVectors(newStart, newEnd, 0.5);
    this.tag.position.copy(mid);
    const p1 = newStart
      .clone()
      .add(uVector.clone().multiplyScalar(-dimStyle.offset));
    const p2 = newEnd
      .clone()
      .add(uVector.clone().multiplyScalar(dimStyle.offset));
    const position: number[] = LocationUtils.getPositionLocationFromPoints([
      p1,
      p2,
    ]);
    if (!this.segment)
      this.segment = LocationUtils.createSegment(this.material, position, 2);
    LocationUtils.updateLineSegmentPosition(position, this.segment);
  }
  updateRadius(start: THREE.Vector3, end: THREE.Vector3) {
    if (!this.tag) return;
    this.length = start.distanceTo(end);
    const {factor, symbol, toFixed} = lengthUnitSignal.value;
    this.tag.userData.content.textContent = `${(this.length * factor).toFixed(
      toFixed
    )} ${symbol}`;

    const mid = new THREE.Vector3().lerpVectors(start, end, 0.5);
    this.tag.position.copy(mid);

    const position: number[] = LocationUtils.getPositionLocationFromPoints([
      start,
      end,
    ]);
    if (!this.segment)
      this.segment = LocationUtils.createSegment(this.material, position, 2);
    LocationUtils.updateLineSegmentPosition(position, this.segment);
  }

  static createInputLabel(css: string): CSS2DObject {
    const div = document.createElement("input");
    div.className = css;
    div.onchange = (e: any) => {
      console.log(e);
    };
    const label = new CSS2DObject(div);
    label.userData.content = div;
    return label;
  }
  static createLabel(css: string): CSS2DObject {
    const div = document.createElement("div");
    div.className = css;
    const label = new CSS2DObject(div);
    label.userData.content = div;
    return label;
  }

  static disposeLabel(label: CSS2DObject) {
    if (!label) return;
    label.removeFromParent();
    label.userData.content?.remove();
  }
  static disposeSegment(segment: THREE.Line) {
    if (!segment) return;
    segment?.geometry.dispose();
    (segment!.geometry as any) = null;
    segment?.removeFromParent();
  }
}
