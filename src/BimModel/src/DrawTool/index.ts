/**
 * @module DrawTool
 */

import * as THREE from "three";
import {
  Components,
  Dimension,
  LocationArc,
  LocationLine,
  RaycasterComponent,
  SelectionComponent,
} from "@BimModel/src";
import {ToolComponent} from "@BimModel/src/Tool";
import {Component, Disposable, UUID} from "@BimModel/src/types";
import {
  BaseDraw,
  DrawArc,
  DrawLine,
  DrawPickLine,
  DrawPoint,
  DrawPolyLines,
  DrawRectangular,
  DrawCircle,
} from "./src";
import {effect} from "@preact/signals-react";
import {currentLevelSignal, drawingTypeSignal} from "@BimModel/src/Signals";
import {ILevel} from "../LevelSystem/types";
export class DrawTool extends Component<string> implements Disposable {
  static readonly uuid = UUID.DrawTool;
  static upDirection = new THREE.Vector3(0, 1, 0);
  enabled = false;

  /** @TempDraw */
  drawingDimension!: Dimension;
  workPlane = new THREE.Plane(DrawTool.upDirection, 0);

  /** @draws  */
  private draws: {[name: string]: BaseDraw} = {};
  set workPlaneLevel(level: ILevel) {
    const {elevation} = level;
    this.workPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(
      DrawTool.upDirection,
      new THREE.Vector3(0, elevation, 0)
    );
  }

  get RaycasterComponent() {
    return this.components.tools.get(RaycasterComponent);
  }
  get SelectionComponent() {
    return this.components.tools.get(SelectionComponent);
  }

  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(DrawTool.uuid, this);
    this.drawingDimension = new Dimension(components);
    this.initDraws();
    effect(() => {
      for (const name in this.draws) {
        const draw = this.draws[name];
        if (drawingTypeSignal.value === "None") {
          draw.setupEvent = false;
          draw.dispose();
        } else {
          draw.setupEvent = drawingTypeSignal.value === name;
        }
      }
      this.RaycasterComponent!.visibleInfo = drawingTypeSignal.value !== "None";
      this.SelectionComponent.setupEvent = drawingTypeSignal.value === "None";
    });
    effect(() => {
      if (!currentLevelSignal.value) return;
      this.workPlaneLevel = currentLevelSignal.value;
    });
  }
  async dispose() {
    this.drawingDimension?.dispose();
    for (const name in this.draws) {
      this.draws[name]?.dispose();
    }
    this.draws = {};
  }

  get() {
    return DrawTool.uuid;
  }
  private initDraws() {
    this.draws["Line"] = new DrawLine(this.components, this.workPlane);
    this.draws["Rectangular"] = new DrawRectangular(
      this.components,
      this.workPlane
    );
    this.draws["PolyLines"] = new DrawPolyLines(
      this.components,
      this.workPlane
    );
    this.draws["Arc"] = new DrawArc(this.components, this.workPlane);
    this.draws["Circle"] = new DrawCircle(this.components, this.workPlane);
    this.draws["Point"] = new DrawPoint(this.components, this.workPlane);
    this.draws["PickLine"] = new DrawPickLine(this.components, this.workPlane);
  }
}
ToolComponent.libraryUUIDs.add(DrawTool.uuid);
