import {Components} from "../Components";
import {ProjectComponent} from "../ProjectComponent";
import {ToolComponent} from "../Tool";
import {Component, Disposable, UUID} from "../types";
import {createModelingContainer, createOptionContainer} from "./src";
export class ModelingComponent extends Component<any> implements Disposable {
  static readonly uuid = UUID.ModelingComponent;
  enabled = false;
  private modelingContainer!: HTMLDivElement;
  private optionContainer!: HTMLDivElement;
  get ProjectComponent(): ProjectComponent {
    return this.components.tools.get(ProjectComponent);
  }
  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(ModelingComponent.uuid, this);
  }
  async dispose() {
    this.modelingContainer?.remove();
    this.optionContainer?.remove();
    (this.modelingContainer as any) = null;
  }
  get() {
    throw new Error("Method not implemented.");
  }
  init(container: HTMLDivElement, option: HTMLDivElement) {
    this.modelingContainer = createModelingContainer(this);
    container.appendChild(this.modelingContainer);
    this.optionContainer = createOptionContainer(this);
    option.appendChild(this.optionContainer);
  }
}
ToolComponent.libraryUUIDs.add(ModelingComponent.uuid);
