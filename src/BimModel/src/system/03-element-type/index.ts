/**
 * @module ElementTypeSystem
 */

import * as THREE from "three";
import {Components} from "@BimModel/src/Components";
import {ToolComponent} from "@BimModel/src/Tool";
import {Component, Disposable} from "@BimModel/src/types";
import {systemGUID} from "../constants";
export class ElementTypeSystem extends Component<string> implements Disposable {
  static readonly uuid = systemGUID.elementType;
  enabled = false;

  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(ElementTypeSystem.uuid, this);
  }
  async dispose() {}

  get() {
    return ElementTypeSystem.uuid;
  }
}
ToolComponent.libraryUUIDs.add(ElementTypeSystem.uuid);
