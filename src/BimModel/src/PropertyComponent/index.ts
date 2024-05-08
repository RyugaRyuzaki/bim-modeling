import * as THREE from "three";
import {Components} from "../Components";
import {ToolComponent} from "../Tool";
import {Component, Disposable, UUID} from "../types";
export class PropertyComponent extends Component<any> implements Disposable {
  static readonly uuid = UUID.PropertyComponent;
  enabled = false;

  get() {
    throw new Error("Method not implemented.");
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
