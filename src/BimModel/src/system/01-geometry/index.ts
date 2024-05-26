/**
 * @module GeometrySystem
 */

import * as THREE from "three";
import {Components} from "@BimModel/src/Components";
import {ToolComponent} from "@BimModel/src/Tool";
import {Component, Disposable} from "@BimModel/src/types";
import {systemGUID} from "../constants";
export class GeometrySystem extends Component<string> implements Disposable {
  static readonly uuid = systemGUID.geometry;
  enabled = false;
  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(GeometrySystem.uuid, this);
  }
  async dispose() {}

  get() {
    return GeometrySystem.uuid;
  }
}
ToolComponent.libraryUUIDs.add(GeometrySystem.uuid);
