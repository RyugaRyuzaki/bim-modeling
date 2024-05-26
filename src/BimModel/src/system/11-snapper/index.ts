/**
 * @module SnapperSystem
 */

import * as THREE from "three";
import {Components} from "@BimModel/src/Components";
import {ToolComponent} from "@BimModel/src/Tool";
import {Component, Disposable} from "@BimModel/src/types";
import {systemGUID} from "../constants";
export class SnapperSystem extends Component<string> implements Disposable {
  static readonly uuid = systemGUID.snapper;
  enabled = false;

  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(SnapperSystem.uuid, this);
  }
  async dispose() {}

  get() {
    return SnapperSystem.uuid;
  }
}
ToolComponent.libraryUUIDs.add(SnapperSystem.uuid);
