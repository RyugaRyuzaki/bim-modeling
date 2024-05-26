/**
 * @module DrawToolSystem
 */

import * as THREE from "three";
import {Components} from "@BimModel/src/Components";
import {ToolComponent} from "@BimModel/src/Tool";
import {Component, Disposable} from "@BimModel/src/types";
import {systemGUID} from "../constants";
import {BaseDraw} from "./src";
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
  }
  async dispose() {
    for (const name in this.draws) {
      this.draws[name]?.dispose();
    }
  }

  get() {
    return DrawToolSystem.uuid;
  }
}
ToolComponent.libraryUUIDs.add(DrawToolSystem.uuid);
