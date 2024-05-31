/**
 * @module Snapper
 */

import * as THREE from "three";
import {Components} from "@BimModel/src/Components";
import {ToolComponent} from "@BimModel/src/Tool";
import {Component, Disposable, UUID} from "@BimModel/src/types";
export class Snapper extends Component<string> implements Disposable {
  static readonly uuid = UUID.Snapper;
  enabled = false;

  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(Snapper.uuid, this);
  }
  async dispose() {}

  get() {
    return Snapper.uuid;
  }
}
ToolComponent.libraryUUIDs.add(Snapper.uuid);
