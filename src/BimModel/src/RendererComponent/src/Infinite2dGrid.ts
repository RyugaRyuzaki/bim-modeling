/**
 * @module Infinite2dGrid
 */
import * as THREE from "three";
import {Components} from "../../Components";
import {Disposable} from "../../types";
import {Camera} from "./Camera";
import {showGridLabelSignal} from "@BimModel/src/Signals";
import {effect} from "@preact/signals-react";

/**
 *
 */
export class Infinite2dGrid implements Disposable {
  private widthContainer = 20;

  private maxRegenerate = 4;

  private gridsFactor = 5;

  private scaleX = 1;

  private scaleY = 1;

  private frustum = new THREE.Frustum();

  private frustumMat = new THREE.Matrix4();

  private regenerateDelay = 200;

  private regenerateCounter = 0;

  private horizontalSvg!: SVGElement;

  private horizontalContainer!: HTMLDivElement;

  private verticalSvg!: SVGElement;

  private verticalContainer!: HTMLDivElement;

  set visible(visible: boolean) {
    this.init();
    if (visible) {
      console.log(visible);
      this.components.container.appendChild(this.horizontalContainer);
      this.components.container.appendChild(this.verticalContainer);
    } else {
      this.horizontalContainer.remove();
      this.verticalContainer.remove();
    }
  }

  get horizontalClass() {
    return `absolute top-0 left-0 h-full w-[${this.widthContainer}px] z-1000`;
  }
  get verticalClass() {
    return `absolute bottom-0 left-0 w-full h-[${this.widthContainer}px] z-1000`;
  }

  get currentCamera() {
    return this.camera.currentCamera;
  }
  constructor(private components: Components, private camera: Camera) {
    effect(() => {
      this.visible = showGridLabelSignal.value;
    });
  }

  async dispose() {
    this.horizontalSvg?.remove();
    (this.horizontalSvg as any) = null;
    this.horizontalContainer?.remove();
    (this.horizontalContainer as any) = null;
    this.verticalSvg?.remove();
    (this.verticalSvg as any) = null;
    this.verticalContainer?.remove();
    (this.verticalContainer as any) = null;
  }
  private init() {
    if (!this.horizontalContainer) {
      this.horizontalContainer = document.createElement("div");
      this.horizontalContainer.className = this.horizontalClass;
      this.horizontalContainer.style.width = `${this.widthContainer}px`;
    }
    if (!this.verticalContainer) {
      this.verticalContainer = document.createElement("div");
      this.verticalContainer.className = this.verticalClass;
      this.verticalContainer.style.height = `${this.widthContainer}px`;
    }
  }
  private isGridReady() {
    const nums = this.currentCamera.projectionMatrix.elements;
    for (let i = 0; i < nums.length; i++) {
      const num = nums[i];
      if (Number.isNaN(num)) {
        return false;
      }
    }
    return true;
  }
  regenerate() {
    if (!showGridLabelSignal.value) return;
    const isReady = this.isGridReady();
    if (!isReady) {
      this.regenerateCounter++;
      if (this.regenerateCounter > this.maxRegenerate) {
        throw new Error("Grid could not be regenerated");
      }
      setTimeout(() => this.regenerate, this.regenerateDelay);
      return;
    }
    this.regenerateCounter = 0;

    const matrix = this.frustumMat.multiplyMatrices(
      this.currentCamera.projectionMatrix,
      this.currentCamera.matrixWorldInverse
    );
    this.frustum.setFromProjectionMatrix(matrix);

    // Step 1: find out the distance of the visible area of the 2D scene
    // and the translation pixel / 3d unit

    const {planes} = this.frustum;
    const right = planes[0].constant * -planes[0].normal.x;
    const left = planes[1].constant * -planes[1].normal.x;
    const bottom = planes[2].constant * -planes[2].normal.y;
    const top = planes[3].constant * -planes[3].normal.y;
    const horizontalDistance = Math.abs(right - left);
    const verticalDistance = Math.abs(top - bottom);

    const {width, height} = this.components.rect;
    const maxPixelDist = Math.max(width, height);
    const maxUnit3dDist = Math.max(horizontalDistance, verticalDistance);
    const unit3dPixelRel = maxUnit3dDist / maxPixelDist;

    // Step 2: find out its order of magnitude

    const magnitudeX = Math.ceil(Math.log10(horizontalDistance / this.scaleX));
    const magnitudeY = Math.ceil(Math.log10(verticalDistance / this.scaleY));

    // Step 3: represent main grid
    const sDistanceHor = 10 ** (magnitudeX - 2) * this.scaleX;
    const sDistanceVert = 10 ** (magnitudeY - 2) * this.scaleY;
    const mDistanceHor = sDistanceHor * this.gridsFactor;
    const mDistanceVert = sDistanceVert * this.gridsFactor;

    const mainGridCountVert = Math.ceil(verticalDistance / mDistanceVert);
    const mainGridCountHor = Math.ceil(horizontalDistance / mDistanceHor);
    const secondaryGridCountVert = Math.ceil(verticalDistance / sDistanceVert);
    const secondaryGridCountHor = Math.ceil(horizontalDistance / sDistanceHor);

    // Step 4: find out position of first lines
    const sTrueLeft = sDistanceHor * Math.ceil(left / sDistanceHor);
    const sTrueBottom = sDistanceVert * Math.ceil(bottom / sDistanceVert);
    const mTrueLeft = mDistanceHor * Math.ceil(left / mDistanceHor);
    const mTrueBottom = mDistanceVert * Math.ceil(bottom / mDistanceVert);
    console.log(sTrueLeft);
    // // Step 5: draw lines and texts
    // const numbers = [...this.numbers.children];
    // for (const number of numbers) {
    //   number.removeFromParent();
    // }
    // this.numbers.children = [];

    // const mPoints = [];

    // const realWidthPerCharacter = 9 * unit3dPixelRel; // 9 pixels per char

    // const p = 10000;

    // // Avoid horizontal text overlap by computing the real width of a text
    // // and computing which lines should have a label starting from zero
    // const minLabel = Math.round(Math.abs(mTrueLeft / this.scaleX) * p) / p;
    // const maxDist = (mainGridCountHor - 1) * mDistanceHor;
    // const maxLabel =
    //   Math.round(Math.abs((mTrueLeft + maxDist) / this.scaleX) * p) / p;
    // const biggestLabelLength = Math.max(minLabel, maxLabel).toString().length;
    // const biggestLabelSize = biggestLabelLength * realWidthPerCharacter;
    // const cellsOccupiedByALabel = Math.ceil(biggestLabelSize / mDistanceHor);
    // let offsetToZero = cellsOccupiedByALabel * mDistanceHor;

    // for (let i = 0; i < mainGridCountHor; i++) {
    //   let offset = mTrueLeft + i * mDistanceHor;
    //   mPoints.push(offset, top, 0, offset, bottom, 0);

    //   const value = offset / this.scaleX;

    //   offset = Math.round(offset * p) / p;
    //   offsetToZero = Math.round(offsetToZero * p) / p;
    //   const result = offset % offsetToZero;

    //   // TODO: Removing horizontal labels for clarity doesn't work for small distances
    //   const isSmall = mDistanceHor < 1 || mDistanceVert < 1;

    //   if (!isSmall && Math.abs(result) > 0.01) {
    //     continue;
    //   }

    //   const sign = this.newNumber(value);
    //   const textOffsetPixels = 12;
    //   const textOffset = textOffsetPixels * unit3dPixelRel;
    //   sign.position.set(offset, bottom + textOffset, 0);
    // }
    // for (let i = 0; i < mainGridCountVert; i++) {
    //   const offset = mTrueBottom + i * mDistanceVert;
    //   mPoints.push(left, offset, 0, right, offset, 0);
    //   const sign = this.newNumber(offset / this.scaleY);
    //   let textOffsetPixels = 12;
    //   if (sign.element.textContent) {
    //     textOffsetPixels += 4 * sign.element.textContent.length;
    //   }
    //   const textOffset = textOffsetPixels * unit3dPixelRel;
    //   sign.position.set(left + textOffset, offset, 0);
    // }

    // const sPoints = [];
    // for (let i = 0; i < secondaryGridCountHor; i++) {
    //   const offset = sTrueLeft + i * sDistanceHor;
    //   sPoints.push(offset, top, 0, offset, bottom, 0);
    // }
    // for (let i = 0; i < secondaryGridCountVert; i++) {
    //   const offset = sTrueBottom + i * sDistanceVert;
    //   sPoints.push(left, offset, 0, right, offset, 0);
    // }

    // const mBuffer = new THREE.BufferAttribute(new Float32Array(mPoints), 3);
    // const sBuffer = new THREE.BufferAttribute(new Float32Array(sPoints), 3);
    // const {main, secondary} = this.grids;
    // main.geometry.setAttribute("position", mBuffer);
    // secondary.geometry.setAttribute("position", sBuffer);
  }
}
