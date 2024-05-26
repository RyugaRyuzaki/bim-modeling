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
import {LevelSystem} from "../system";
import {RendererComponent} from "../RendererComponent";

export * from "./src";
export class ProjectComponent extends Component<string> implements Disposable {
  static readonly uuid = UUID.ProjectComponent;
  enabled = false;
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
}
ToolComponent.libraryUUIDs.add(ProjectComponent.uuid);
