import * as THREE from "three";
import {
  createSVG,
  createInputAnnotationContainer,
  createTextSVG,
  setUpPath,
  strokeStyle,
  createLineSVG,
  createInputNumberAnnotationContainer,
  lengthUnitSignal,
} from "@BimModel/src";
import {Disposable} from "@BimModel/src/types";
import {CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer";
import {effect, signal, Signal} from "@preact/signals-react";
import {ILevel} from "../../types";

/**
 *
 */
export class LevelAnnotation implements Disposable {
  private static readonly width = 80;
  private static readonly height = 40;
  private static readonly offset = 6;
  set setupEvent(enabled: boolean) {
    if (!this.nameSvg || !this.elevationSvg) return;
    if (enabled) {
      this.nameSvg.addEventListener("dblclick", this.onNameDoubleClick);
      this.elevationSvg.addEventListener(
        "dblclick",
        this.onElevationDoubleClick
      );
    } else {
      this.nameSvg.removeEventListener("dblclick", this.onNameDoubleClick);
      this.elevationSvg.removeEventListener(
        "dblclick",
        this.onElevationDoubleClick
      );
    }
  }
  svg!: SVGElement;
  label!: CSS2DObject;
  container!: HTMLDivElement;
  name!: HTMLDivElement;
  nameSvg!: SVGElement;
  nameSignal: Signal<string | number | null> = signal(null);
  elevation!: HTMLDivElement;
  elevationSvg!: SVGElement;
  elevationSignal: Signal<number> = signal(0);

  private _showName = false;
  set showName(show: boolean) {
    if (!this.name) return;
    this._showName = show;
    if (show) {
      this.container.appendChild(this.name);
    } else {
      this.name.remove();
    }
  }
  get showName() {
    return this._showName;
  }
  private _showElevation = false;
  set showElevation(show: boolean) {
    if (!this.elevation) return;
    this._showElevation = show;
    if (show) {
      this.container.appendChild(this.elevation);
    } else {
      this.elevation.remove();
    }
  }
  get showElevation() {
    return this._showElevation;
  }
  get point() {
    return this.label?.position;
  }
  /**
   *
   */
  constructor(private level: ILevel, point: THREE.Vector3) {
    this.init(point);
    this.nameSignal.value = this.level.name;
    this.elevationSignal.value =
      this.level.elevation * lengthUnitSignal.value.factor;
    this.setupEvent = true;
    effect(() => {
      if (!this.nameSignal.value) return;
      if (!this.svg) return;
      if (!this.name) {
        this.name = createInputAnnotationContainer(
          this.nameSignal,
          this.onNameBlur,
          60
        );
        this.name.style.top = `${-8}px`;
        this.name.style.left = `${LevelAnnotation.offset * 2}px`;
      }
      this.nameSvg!.textContent = this.nameSignal.value as string;
    });
    effect(() => {
      if (!this.svg) return;
      if (!this.elevation) {
        this.elevation = createInputNumberAnnotationContainer(
          this.elevationSignal,
          this.onElevationBlur,
          60
        );
        this.elevation.style.top = `${18}px`;
        this.elevation.style.left = `${LevelAnnotation.offset * 2}px`;
      }

      this.elevationSvg!.textContent = this.elevationSignal.value.toString();
    });
  }
  async dispose() {
    this.setupEvent = false;
    this.nameSvg?.remove();
    (this.nameSvg as any) = null;
    this.name?.remove();
    (this.name as any) = null;
    this.elevationSvg?.remove();
    (this.elevationSvg as any) = null;
    this.svg?.remove();
    (this.svg as any) = null;
    this.elevation?.remove();
    (this.elevation as any) = null;
    this.container?.remove();
    (this.container as any) = null;
    this.label?.removeFromParent();
    (this.label as any) = null;
  }
  private init(point: THREE.Vector3) {
    this.initLevelAnnotation();
    this.label = new CSS2DObject(this.container);
    this.label.position.copy(point);
  }

  private onNameDoubleClick = (_e: MouseEvent) => {
    _e.preventDefault();
    _e.stopPropagation();
    this.showName = true;
  };
  private onElevationDoubleClick = (_e: MouseEvent) => {
    _e.preventDefault();
    _e.stopPropagation();
    this.showElevation = true;
  };
  onNameBlur = (value: string) => {
    this.showName = false;
    this.nameSignal.value = value;
  };
  onElevationBlur = (value: string) => {
    this.showElevation = false;
    this.elevationSignal.value = +value;
    const newValue = +value / lengthUnitSignal.value.factor;
    if (this.onChangeLevel) this.onChangeLevel(newValue);
  };
  onChangeLevel!: (value: number) => void;
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

    return svg;
  }
  private initLevelAnnotation() {
    this.container = this.createAnnotationContainer(
      LevelAnnotation.width,
      LevelAnnotation.height
    );
    this.container.style.top = `${-LevelAnnotation.height / 2}px`;
    this.container.style.left = `${LevelAnnotation.width / 2}px`;
    this.svg = this.createSvgCenter(
      this.container,
      LevelAnnotation.width,
      LevelAnnotation.height
    );
    this.nameSvg = createTextSVG(
      this.svg,
      LevelAnnotation.width / 6 + 8,
      LevelAnnotation.height / 2 - 8,
      this.nameSignal.value as string,
      true
    );
    this.nameSvg.classList.add("cursor-pointer");
    this.nameSvg.classList.add("pointer-events-auto");
    this.elevationSvg = createTextSVG(
      this.svg,
      LevelAnnotation.width / 6 + 8,
      LevelAnnotation.height / 2 + 10,
      this.nameSignal.value as string,
      true
    );
    this.elevationSvg.classList.add("cursor-pointer");
    this.elevationSvg.classList.add("pointer-events-auto");
    this.drawTriangle();
    createLineSVG(
      this.svg,
      0,
      LevelAnnotation.height / 2,
      LevelAnnotation.width,
      LevelAnnotation.height / 2
    );
    createLineSVG(
      this.svg,
      LevelAnnotation.offset,
      0,
      LevelAnnotation.offset,
      LevelAnnotation.height
    );
  }
  private drawTriangle() {
    const points: THREE.Vector2[] = [];
    points.push(
      new THREE.Vector2(0, LevelAnnotation.height - LevelAnnotation.offset)
    );
    points.push(
      new THREE.Vector2(LevelAnnotation.offset, LevelAnnotation.height)
    );
    points.push(
      new THREE.Vector2(
        LevelAnnotation.offset * 2,
        LevelAnnotation.height - LevelAnnotation.offset
      )
    );
    const path = setUpPath(this.svg, points);
    path.setAttributeNS(null, "fill", strokeStyle.fillColor);
  }
}
