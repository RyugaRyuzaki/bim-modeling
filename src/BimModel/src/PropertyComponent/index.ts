import * as THREE from "three";
import {Components} from "../Components";
import {ToolComponent} from "../Tool";
import {Component, Disposable, UUID} from "../types";
export class PropertyComponent extends Component<string> implements Disposable {
  static readonly uuid = UUID.PropertyComponent;
  enabled = false;

  get() {
    return PropertyComponent.uuid;
  }
  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(PropertyComponent.uuid, this);
  }
  async dispose() {}
}
ToolComponent.libraryUUIDs.add(PropertyComponent.uuid);
