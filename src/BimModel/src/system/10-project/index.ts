/**
 * @module ProjectSystem
 */

import * as THREE from "three";
import {Components} from "@BimModel/src/Components";
import {ToolComponent} from "@BimModel/src/Tool";
import {Component, Disposable} from "@BimModel/src/types";
import {systemGUID} from "../constants";
export class ProjectSystem extends Component<string> implements Disposable {
  static readonly uuid = systemGUID.project;
  enabled = false;

  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(ProjectSystem.uuid, this);
  }
  async dispose() {}

  get() {
    return ProjectSystem.uuid;
  }
}
ToolComponent.libraryUUIDs.add(ProjectSystem.uuid);
