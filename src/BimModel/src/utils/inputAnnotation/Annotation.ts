import * as THREE from "three";
import {
  createSVG,
  createEllipse,
  borderColor,
  createInputAnnotationContainer,
  createTextSVG,
  createRectSVG,
  setUpPath,
  strokeStyle,
  createLineSVG,
} from "@BimModel/src";
import {Disposable} from "@BimModel/src/types";
import {CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer";
import {effect, signal, Signal} from "@preact/signals-react";

/**
 *
 */
export class Annotation implements Disposable {
  set setupEvent(enabled: boolean) {
    if (!this.svg || !this.label || !this.container) return;
    if (enabled) {
      this.svg.addEventListener("dblclick", this.onDoubleClick);
    } else {
      this.svg.removeEventListener("dblclick", this.onDoubleClick);
    }
  }
  svg!: SVGElement;
  textSvg!: SVGElement;
  container!: HTMLDivElement;
  input!: HTMLDivElement;
  label!: CSS2DObject;
  nameSignal: Signal<string | number | null> = signal(null);

  private _showInput = false;
  set showInput(show: boolean) {
    if (!this.input) return;
    this._showInput = show;
    if (show) {
      this.container.appendChild(this.input);
    } else {
      this.input.remove();
    }
  }
  get showInput() {
    return this._showInput;
  }
  get point() {
    return this.label?.position;
  }
  /**
   *
   */
  constructor(
    point: THREE.Vector3,
    left: number,
    top: number,
    width: number,
    height: number
  ) {
    this.init(point, width, height);
    effect(() => {
      if (!this.nameSignal.value) return;
      if (!this.svg) return;
      if (!this.input) {
        this.input = createInputAnnotationContainer(
          this.nameSignal,
          this.onInputBlur
        );
        this.input.style.top = "10px";
      }
      if (!this.textSvg) {
        this.textSvg = createTextSVG(
          this.svg,
          left - 8,
          top,
          this.nameSignal.value as string,
          true
        );
      } else {
        this.textSvg.textContent = this.nameSignal.value as string;
      }
    });
    this.setupEvent = true;
  }
  async dispose() {
    this.setupEvent = false;
    this.textSvg?.remove();
    (this.textSvg as any) = null;
    this.svg?.remove();
    (this.svg as any) = null;
    this.input?.remove();
    (this.input as any) = null;
    this.container?.remove();
    (this.container as any) = null;
    this.label?.removeFromParent();
    (this.label as any) = null;
  }
  private init(point: THREE.Vector3, width: number, height: number) {
    this.container = this.createAnnotationContainer(width, height);
    this.svg = this.createSvgCenter(this.container, width, height);
    this.label = new CSS2DObject(this.container);
    this.label.position.copy(point);
  }

  private onDoubleClick = (_e: MouseEvent) => {
    _e.preventDefault();
    _e.stopPropagation();
    this.showInput = true;
  };
  onInputBlur = (value: string) => {
    this.showInput = false;
    if (this.onChangeName) this.onChangeName(value);
  };
  onChangeName!: (value: string) => void;

  private createAnnotationContainer(width: number, height: number) {
    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.width = `${width}px`;
    div.style.height = `${height}px`;
    div.style.top = `${0}px`;
    div.style.left = `${0}px`;
    return div;
  }
  private createSvgCenter(
    container: HTMLDivElement,
    width: number,
    height: number
  ) {
    const svg = createSVG(container, width, height);
    svg.classList.add("absolute");
    svg.classList.add("cursor-pointer");
    svg.classList.add("pointer-events-auto");
    return svg;
  }
  static initGridAnnotation(svg: SVGElement, radius: number) {
    const center = radius / 2;
    const circle = createEllipse(
      svg,
      center,
      center,
      0.9 * center,
      0.9 * center
    );
    circle.setAttributeNS(null, "fill", "#fcf8f7");
    circle.setAttributeNS(null, "stroke", borderColor);
    circle.setAttributeNS(null, "stroke-width", `2`);
  }
  static initLevelAnnotation(svg: SVGElement, radius: number, left = true) {
    this.drawTriangle(svg, radius, left);
    const offset = ((left ? 1 : 5) * radius) / 6;
    createLineSVG(svg, 0, (radius * 2) / 3, radius, (radius * 2) / 3);
    createLineSVG(svg, offset, radius / 3, offset, radius);
  }
  private static drawTriangle(svg: SVGElement, radius: number, left = true) {
    const points: THREE.Vector2[] = [];
    const offset = left ? 0 : (4 * radius) / 6;
    points.push(new THREE.Vector2(offset, (5 * radius) / 6));
    points.push(new THREE.Vector2(offset + radius / 6, radius));
    points.push(new THREE.Vector2(offset + (2 * radius) / 6, (5 * radius) / 6));
    const path = setUpPath(svg, points);
    path.setAttributeNS(null, "fill", strokeStyle.fillColor);
  }
}
