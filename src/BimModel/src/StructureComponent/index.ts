import * as THREE from "three";
import {Components} from "../Components";
import {ToolComponent} from "../Tool";
import {Component, Disposable, UUID} from "../types";
export class StructureComponent
  extends Component<string>
  implements Disposable
{
  static readonly uuid = UUID.StructureComponent;
  enabled = false;

  get() {
    return StructureComponent.uuid;
  }
  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(StructureComponent.uuid, this);
  }
  async dispose() {}
}
ToolComponent.libraryUUIDs.add(StructureComponent.uuid);
