/**
 * @module ElementSystem
 */

import * as THREE from "three";
import {Components} from "@BimModel/src/Components";
import {ToolComponent} from "@BimModel/src/Tool";
import {Component, Disposable} from "@BimModel/src/types";
import {systemGUID} from "../constants";
export class ElementSystem extends Component<string> implements Disposable {
  static readonly uuid = systemGUID.element;
  enabled = false;

  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(ElementSystem.uuid, this);
  }
  async dispose() {}

  get() {
    return ElementSystem.uuid;
  }
}
ToolComponent.libraryUUIDs.add(ElementSystem.uuid);
