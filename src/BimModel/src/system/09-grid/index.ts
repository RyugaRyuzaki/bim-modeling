/**
 * @module GridSystem
 */

import * as THREE from "three";
import {Components} from "@BimModel/src/Components";
import {ToolComponent} from "@BimModel/src/Tool";
import {Component, Disposable} from "@BimModel/src/types";
import {systemGUID} from "../constants";
export class GridSystem extends Component<string> implements Disposable {
  static readonly uuid = systemGUID.grid;
  enabled = false;

  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(GridSystem.uuid, this);
  }
  async dispose() {}

  get() {
    return GridSystem.uuid;
  }
}
ToolComponent.libraryUUIDs.add(GridSystem.uuid);
