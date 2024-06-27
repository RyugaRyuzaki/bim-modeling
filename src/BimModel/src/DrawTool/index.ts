/**
 * @module DrawTool
 */

import * as THREE from "three";
import {
  Components,
  MovingLine,
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
  BaseModify,
  ModifyCopy,
  ModifyMove,
} from "./src";
import {effect} from "@preact/signals-react";
import {
  currentLevelSignal,
  drawingTypeSignal,
  modelingSignal,
  modifySignal,
} from "@BimModel/src/Signals";
import {ILevel} from "../LevelSystem/types";
export class DrawTool extends Component<string> implements Disposable {
  static readonly uuid = UUID.DrawTool;
  static upDirection = new THREE.Vector3(0, 1, 0);
  enabled = false;

  /** @TempDraw */
  workPlane = new THREE.Plane(DrawTool.upDirection, 0);

  /** @draws  */
  private draws: {[name: string]: BaseDraw} = {};
  private modifies: {[name: string]: BaseModify} = {};
  set workPlaneLevel(level: ILevel) {
    const {elevation} = level;
    this.workPlane.setFromNormalAndCoplanarPoint(
      DrawTool.upDirection,
      new THREE.Vector3(0, elevation, 0)
    );
  }
  movingLine = new MovingLine(this.components);
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
    this.initDraws();
    this.initModify();
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
    });
    effect(() => {
      this.SelectionComponent.setupEvent = modelingSignal.value === null;
    });
    effect(() => {
      for (const name in this.modifies) {
        const modify = this.modifies[name];
        if (modifySignal.value === null) {
          modify.setupEvent = false;
          modify.dispose();
        } else {
          modify.setupEvent = modifySignal.value === name;
        }
      }
      this.SelectionComponent.setupEvent = modifySignal.value === null;
    });
    effect(() => {
      if (!currentLevelSignal.value) return;
      this.workPlaneLevel = currentLevelSignal.value;
    });
  }
  async dispose() {
    for (const name in this.draws) {
      this.draws[name]?.dispose();
    }
    this.draws = {};
    for (const name in this.modifies) {
      this.modifies[name]?.dispose();
    }
    this.modifies = {};
    this.movingLine?.dispose();
    (this.movingLine as any) = null;
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
  private initModify() {
    this.modifies["Copy"] = new ModifyCopy(this.components);
    this.modifies["Move"] = new ModifyMove(this.components);
  }
}
ToolComponent.libraryUUIDs.add(DrawTool.uuid);
