/**
 * @module CategorySystem
 */

import * as THREE from "three";
import {Components} from "@BimModel/src/Components";
import {ToolComponent} from "@BimModel/src/Tool";
import {Component, Disposable} from "@BimModel/src/types";
import {systemGUID} from "../constants";
export class CategorySystem extends Component<string> implements Disposable {
  static readonly uuid = systemGUID.category;
  enabled = false;

  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(CategorySystem.uuid, this);
  }
  async dispose() {}

  get() {
    return CategorySystem.uuid;
  }
}
ToolComponent.libraryUUIDs.add(CategorySystem.uuid);
