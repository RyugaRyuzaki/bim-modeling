/**
 * @module ParameterSystem
 */

import * as THREE from "three";
import {Components} from "@BimModel/src/Components";
import {ToolComponent} from "@BimModel/src/Tool";
import {Component, Disposable} from "@BimModel/src/types";
import {systemGUID} from "../constants";
export class ParameterSystem extends Component<string> implements Disposable {
  static readonly uuid = systemGUID.parameter;
  enabled = false;

  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(ParameterSystem.uuid, this);
  }
  async dispose() {}

  get() {
    return ParameterSystem.uuid;
  }
}
ToolComponent.libraryUUIDs.add(ParameterSystem.uuid);
