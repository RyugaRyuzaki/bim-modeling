import * as THREE from "three";
import {Components} from "../Components";
import {ToolComponent} from "../Tool";
import {Component, Disposable, UUID} from "../types";
import {ProjectComponent} from "../ProjectComponent";
export class PropertyComponent extends Component<string> implements Disposable {
  static readonly uuid = UUID.PropertyComponent;
  enabled = false;
  get ProjectComponent(): ProjectComponent {
    return this.components.tools.get(ProjectComponent);
  }

  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(PropertyComponent.uuid, this);
  }
  async dispose() {}
  get() {
    return PropertyComponent.uuid;
  }
}
ToolComponent.libraryUUIDs.add(PropertyComponent.uuid);
