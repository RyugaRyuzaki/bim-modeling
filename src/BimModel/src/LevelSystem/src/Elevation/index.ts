import * as THREE from "three";
import {CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer";
import {
  Components,
  Disposable,
  CubeMapComponent,
  createSVG,
  createRectSVG,
  setUpPath,
  strokeStyle,
  LevelSystem,
  selectViewSignal,
} from "@BimModel/src";
import {IElevation, ILevel, IView} from "../../types";

export class Elevation implements Disposable {
  get CubeMapComponent() {
    return this.components.tools.get(CubeMapComponent);
  }
  get transFormControls() {
    return this.components.tools.get(LevelSystem).transFormControls;
  }
  private _visible = false;
  set visible(visible: boolean) {
    if (!this.label) return;
    if (this._visible === visible) return;
    this._visible = visible;
    if (visible) {
      this.components.annotationScene.add(this.label);
    } else {
      this.label.removeFromParent();
    }
  }
  set level(level: ILevel | null) {
    this.visible = level !== null;
    if (!level) return;
    this.label!.position.y = level?.elevation;
  }
  svg!: SVGElement;
  container!: HTMLDivElement;
  label!: CSS2DObject;
  set setupEvent(enabled: boolean) {
    if (!this.svg || !this.container || !this.label) return;
    if (enabled) {
      this.svg.addEventListener("click", this.onClick);
    } else {
      this.svg.removeEventListener("click", this.onClick);
    }
  }
  /**
   *
   */
  constructor(private components: Components, private view: IView) {
    this.init();
    this.setupEvent = true;
  }
  async dispose() {
    this.setupEvent = false;
    this.svg?.remove();
    (this.svg as any) = null;
    this.container?.remove();
    (this.container as any) = null;
    this.label?.removeFromParent();
    (this.label as any) = null;
  }
  private init() {
    this.container = Elevation.createDiv();
    this.svg = Elevation.createSvgCenter(
      this.container,
      this.view.elevationType!
    );
    this.svg.classList.add("cursor-pointer");
    this.svg.classList.add("pointer-events-auto");
    this.label = new CSS2DObject(this.container);
    const {center} = this.CubeMapComponent.sphere;
    const {max, min} = this.CubeMapComponent.box;
    switch (this.view.elevationType!) {
      case "South":
        this.label.position.set(0, center.y, max.z * Elevation.offsetFactor);
        break;
      case "West":
        this.label.position.set(min.x * Elevation.offsetFactor, center.y, 0);
        break;
      case "East":
        this.label.position.set(max.x * Elevation.offsetFactor, center.y, 0);
        break;
      case "North":
        this.label.position.set(0, center.y, min.z * Elevation.offsetFactor);
        break;
    }
    this.label.lookAt(center);
  }

  private onClick = () => {
    selectViewSignal.value = this.view;
  };
  private static readonly square = 50;
  private static readonly offsetFactor = 0.5;
  private static createDiv() {
    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.width = `${this.square}px`;
    div.style.height = `${this.square}px`;
    div.style.top = `${0}px`;
    div.style.left = `${0}px`;
    return div;
  }
  private static createSvgCenter(
    container: HTMLDivElement,
    elevation: IElevation
  ) {
    const svg = createSVG(container, this.square, this.square);
    createRectSVG(
      svg,
      this.square / 4,
      this.square / 4,
      this.square / 2,
      this.square / 2
    );
    const points = this.getElevationPoints(elevation);
    const path = setUpPath(svg, points);
    path.setAttributeNS(null, "fill", strokeStyle.fillColor);
    return svg;
  }
  private static getElevationPoints(elevation: IElevation): THREE.Vector2[] {
    const points: THREE.Vector2[] = [];
    switch (elevation) {
      case "North":
        points.push(new THREE.Vector2(this.square / 4, (this.square * 3) / 4));
        points.push(new THREE.Vector2(this.square / 2, this.square));
        points.push(
          new THREE.Vector2((this.square * 3) / 4, (this.square * 3) / 4)
        );
        break;
      case "East":
        points.push(new THREE.Vector2(this.square / 4, this.square / 4));
        points.push(new THREE.Vector2(0, this.square / 2));
        points.push(new THREE.Vector2(this.square / 4, (this.square * 3) / 4));
        break;
      case "South":
        points.push(new THREE.Vector2((this.square * 3) / 4, this.square / 4));
        points.push(new THREE.Vector2(this.square / 2, 0));
        points.push(new THREE.Vector2(this.square / 4, this.square / 4));
        break;
      case "West":
        points.push(
          new THREE.Vector2((this.square * 3) / 4, (this.square * 3) / 4)
        );
        points.push(new THREE.Vector2(this.square, this.square / 2));
        points.push(new THREE.Vector2((this.square * 3) / 4, this.square / 4));
        break;
    }
    return points;
  }
}
