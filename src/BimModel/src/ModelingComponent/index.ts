import * as THREE from "three";
import {Components} from "../Components";
import {ToolComponent} from "../Tool";
import {Component, Disposable, UUID} from "../types";
import {createModelingContainer} from "./src";
export class ModelingComponent extends Component<any> implements Disposable {
  static readonly uuid = UUID.ModelingComponent;
  enabled = false;
  private modelingContainer!: HTMLDivElement;
  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(ModelingComponent.uuid, this);
  }
  async dispose() {
    this.modelingContainer?.remove();
    (this.modelingContainer as any) = null;
  }
  get() {
    throw new Error("Method not implemented.");
  }
  init(container: HTMLDivElement) {
    this.modelingContainer = createModelingContainer(this);
    container.appendChild(this.modelingContainer);
  }
}
ToolComponent.libraryUUIDs.add(ModelingComponent.uuid);
