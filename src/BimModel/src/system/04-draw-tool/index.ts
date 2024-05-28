/**
 * @module DrawToolSystem
 */

import * as THREE from "three";
import {Components, RaycasterComponent} from "@BimModel/src";
import {ToolComponent} from "@BimModel/src/Tool";
import {Component, Disposable} from "@BimModel/src/types";
import {systemGUID} from "../constants";
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
import {drawingTypeSignal} from "@BimModel/src/Signals";
export class DrawToolSystem extends Component<string> implements Disposable {
  static readonly uuid = systemGUID.drawTool;
  enabled = false;
  private draws: {[name: string]: BaseDraw} = {};

  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(DrawToolSystem.uuid, this);
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
      this.components.tools.get(RaycasterComponent)!.visibleInfo =
        drawingTypeSignal.value !== "None";
    });
  }
  async dispose() {
    for (const name in this.draws) {
      this.draws[name]?.dispose();
    }
    this.draws = {};
  }

  get() {
    return DrawToolSystem.uuid;
  }
  private initDraws() {
    this.draws["Line"] = new DrawLine(this.components);
    this.draws["Rectangular"] = new DrawRectangular(this.components);
    this.draws["PolyLines"] = new DrawPolyLines(this.components);
    this.draws["Arc"] = new DrawArc(this.components);
    this.draws["Point"] = new DrawPoint(this.components);
    this.draws["PickLine"] = new DrawPickLine(this.components);
    this.draws["Circle"] = new DrawCircle(this.components);
  }
}
ToolComponent.libraryUUIDs.add(DrawToolSystem.uuid);
