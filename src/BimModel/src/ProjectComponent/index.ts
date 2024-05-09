import {Components} from "../Components";
import {ToolComponent} from "../Tool";
import {Component, Disposable, UUID} from "../types";

export * from "./src";
export class ProjectComponent extends Component<string> implements Disposable {
  static readonly uuid = UUID.ProjectComponent;
  enabled = false;

  get() {
    return ProjectComponent.uuid;
  }
  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(ProjectComponent.uuid, this);
  }
  async dispose() {}
}
ToolComponent.libraryUUIDs.add(ProjectComponent.uuid);
