/**
 * @module StructureComponent
 */
import {Components} from "../Components";
import {ToolComponent} from "../Tool";
import {Component, Disposable, UUID} from "../types";
import {ProjectComponent} from "../ProjectComponent";
import {createStructureContainer} from "./src";
import {IStructure} from "./types";

export class StructureComponent
  extends Component<string>
  implements Disposable
{
  static readonly uuid = UUID.StructureComponent;
  readonly modelStructure = "Model Structure";
  enabled = false;
  private container!: HTMLDivElement;
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
  async dispose() {
    this.container?.remove();
    (this.container as any) = null;
  }
  get() {
    return StructureComponent.uuid;
  }
  init(_structure: HTMLDivElement) {
    this.container = createStructureContainer(this);
    _structure.appendChild(this.container);
  }
  onVisibility = (_visible: boolean, _structure: IStructure) => {
    //
  };
}
ToolComponent.libraryUUIDs.add(StructureComponent.uuid);
