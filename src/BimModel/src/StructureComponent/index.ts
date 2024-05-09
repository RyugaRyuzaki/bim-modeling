import * as THREE from "three";
import {Components} from "../Components";
import {ToolComponent} from "../Tool";
import {Component, Disposable, UUID} from "../types";
import {ProjectComponent} from "../ProjectComponent";
export class StructureComponent
  extends Component<string>
  implements Disposable
{
  static readonly uuid = UUID.StructureComponent;
  enabled = false;
  get ProjectComponent(): ProjectComponent {
    return this.components.tools.get(ProjectComponent);
  }

  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(StructureComponent.uuid, this);
  }
  async dispose() {}
  get() {
    return StructureComponent.uuid;
  }
}
ToolComponent.libraryUUIDs.add(StructureComponent.uuid);
