import {effect} from "@preact/signals-react";
import {Components} from "../Components";
import {ToolComponent} from "../Tool";
import {Component, Disposable, UUID} from "../types";
import {CubeMapComponent} from "../CubeMapComponent";
import {
  clippingPlanesSignal,
  currentLevelSignal,
  visibilityStateSignal,
} from "../Signals";
import {LevelSystem} from "../LevelSystem";
import {RendererComponent} from "../RendererComponent";
import {IStructure} from "./types";
import {createStructureContainer} from "./src";

export class ProjectComponent extends Component<string> implements Disposable {
  static readonly uuid = UUID.ProjectComponent;
  enabled = false;
  private structureContainer!: HTMLDivElement;
  readonly modelStructure = "Model Tree";

  get camera() {
    return this.components.tools.get(RendererComponent)?.camera;
  }

  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(ProjectComponent.uuid, this);
    effect(() => {
      this.components.tools.get(CubeMapComponent)!.visible =
        visibilityStateSignal.value === "3D";

      if (visibilityStateSignal.value === "3D") {
        this.camera!.resetState();
        clippingPlanesSignal.value = [];
        this.components.tools.get(LevelSystem)!.level = null;
      } else {
        this.camera!.saveState();
        if (visibilityStateSignal.value === "Plane") {
          this.components.tools.get(LevelSystem)!.level =
            currentLevelSignal.value;
        } else {
          //
        }
      }
    });
  }
  async dispose() {}
  get() {
    return ProjectComponent.uuid;
  }
  init(_structure: HTMLDivElement) {
    this.structureContainer = createStructureContainer(this);
    _structure.appendChild(this.structureContainer);
  }
  onVisibility = (_visible: boolean, _structure: IStructure) => {};
}
ToolComponent.libraryUUIDs.add(ProjectComponent.uuid);
