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
import {Line2} from "three/examples/jsm/lines/Line2";
import {dimStyle, GeometryCSS} from "../../types";
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
    if (!this.segment || !this.tag || !this.startSymbol || !this.endSymbol)
      return;
    if (visible) {
      this.segment.add(this.startSymbol);
      this.segment.add(this.endSymbol);
      this.segment.add(this.tag);
      this.components.annotationScene.add(this.segment);
    } else {
      this.startSymbol.removeFromParent();
      this.endSymbol.removeFromParent();
      this.tag.removeFromParent();
      this.segment.removeFromParent();
    }
  };
  tag!: CSS2DObject;
  endSymbol!: Line2;
  startSymbol!: Line2;
  segment!: Line2;
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
    Dimension.disposeSegment(this.startSymbol);
    (this.startSymbol as any) = null;
    Dimension.disposeSegment(this.endSymbol);
    (this.endSymbol as any) = null;
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
    this.segment.geometry.setPositions(position);
    const startPosition: number[] = Dimension.getPositionSymbolLine(
      start,
      vVector
    );
    if (!this.startSymbol)
      this.startSymbol = LocationUtils.createSegment(
        this.material,
        startPosition,
        2
      );
    this.startSymbol.geometry.setPositions(startPosition);
    const endPosition: number[] = Dimension.getPositionSymbolLine(end, vVector);
    if (!this.endSymbol)
      this.endSymbol = LocationUtils.createSegment(
        this.material,
        endPosition,
        2
      );
    this.endSymbol.geometry.setPositions(endPosition);
  }
  updateRadius(
    start: THREE.Vector3,
    end: THREE.Vector3,
    workPlane: THREE.Plane
  ) {
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

    const mid = new THREE.Vector3().lerpVectors(start, end, 0.5);
    this.tag.position.copy(mid);

    const position: number[] = LocationUtils.getPositionLocationFromPoints([
      start,
      end,
    ]);
    if (!this.segment)
      this.segment = LocationUtils.createSegment(this.material, position, 2);
    this.segment.geometry.setPositions(position);
    const startPosition: number[] = LocationUtils.getPositionLocationFromPoints(
      [start, end]
    );
    if (!this.startSymbol)
      this.startSymbol = LocationUtils.createSegment(
        this.material,
        startPosition,
        2
      );
    this.startSymbol.geometry.setPositions(startPosition);
    if (!this.endSymbol)
      this.endSymbol = LocationUtils.createSegment(
        this.material,
        startPosition,
        2
      );
    const colors = LocationUtils.getColorArray(3, LocationUtils.colorBaseLine);
    this.endSymbol.geometry.setColors(colors);
    const p1 = end
      .clone()
      .add(uVector.clone().multiplyScalar(-Dimension.sqrt2 * dimStyle.arrow))
      .add(vVector.clone().multiplyScalar(-Dimension.sqrt2 * dimStyle.arrow));
    const p2 = p1
      .clone()
      .add(
        vVector.clone().multiplyScalar(2 * Dimension.sqrt2 * dimStyle.arrow)
      );
    const endPosition: number[] = LocationUtils.getPositionLocationFromPoints([
      p1,
      end,
      p2,
    ]);
    this.endSymbol.geometry.setPositions(endPosition);
  }
  private static sqrt2 = Math.sqrt(2);
  private static getPositionSymbolLine(
    p0: THREE.Vector3,
    direction: THREE.Vector3
  ) {
    const p1 = p0
      .clone()
      .add(direction.clone().multiplyScalar(dimStyle.offset));
    const p2 = p1
      .clone()
      .add(direction.clone().multiplyScalar(dimStyle.extend));
    return LocationUtils.getPositionLocationFromPoints([p1, p2]);
  }

  static createLabel(css: string): CSS2DObject {
    const div = document.createElement("div");
    div.className = css;
    const label = new CSS2DObject(div);
    label.userData.content = div;
    return label;
  }

  private static disposeLabel(label: CSS2DObject) {
    if (!label) return;
    label.removeFromParent();
    label.userData.content?.remove();
  }
  private static disposeSegment(segment: Line2) {
    segment?.geometry.dispose();
    (segment!.geometry as any) = null;
    segment?.removeFromParent();
  }
}
