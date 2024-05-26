/**
 * @module FamilySystem
 */

import * as THREE from "three";
import {Components} from "@BimModel/src/Components";
import {ToolComponent} from "@BimModel/src/Tool";
import {Component, Disposable} from "@BimModel/src/types";
import {systemGUID} from "../constants";
export class FamilySystem extends Component<string> implements Disposable {
  static readonly uuid = systemGUID.family;
  enabled = false;

  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(FamilySystem.uuid, this);
  }
  async dispose() {}

  get() {
    return FamilySystem.uuid;
  }
}
ToolComponent.libraryUUIDs.add(FamilySystem.uuid);
