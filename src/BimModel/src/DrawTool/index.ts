/**
 * @module DrawTool
 */

import * as THREE from "three";
import {Components, Dimension, RaycasterComponent} from "@BimModel/src";
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
import {drawingTypeSignal} from "@BimModel/src/Signals";
export class DrawTool extends Component<string> implements Disposable {
  static readonly uuid = UUID.DrawTool;
  enabled = false;
  drawingDimension!: Dimension;
  private draws: {[name: string]: BaseDraw} = {};

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
      this.components.tools.get(RaycasterComponent)!.visibleInfo =
        drawingTypeSignal.value !== "None";
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
    this.draws["Line"] = new DrawLine(this.components);
    this.draws["Rectangular"] = new DrawRectangular(this.components);
    this.draws["PolyLines"] = new DrawPolyLines(this.components);
    this.draws["Arc"] = new DrawArc(this.components);
    this.draws["Point"] = new DrawPoint(this.components);
    this.draws["PickLine"] = new DrawPickLine(this.components);
    this.draws["Circle"] = new DrawCircle(this.components);
  }
}
ToolComponent.libraryUUIDs.add(DrawTool.uuid);
