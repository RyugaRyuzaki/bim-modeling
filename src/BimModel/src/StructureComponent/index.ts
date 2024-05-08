import * as THREE from "three";
import {Components} from "../Components";
import {ToolComponent} from "../Tool";
import {Component, Disposable, UUID} from "../types";
export class StructureComponent extends Component<any> implements Disposable {
  static readonly uuid = UUID.StructureComponent;
  enabled = false;

  get() {
    throw new Error("Method not implemented.");
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
