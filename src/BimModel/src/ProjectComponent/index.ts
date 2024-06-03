import {effect} from "@preact/signals-react";
import {Components} from "../Components";
import {ToolComponent} from "../Tool";
import {Component, Disposable, UUID} from "../types";
import {CubeMapComponent} from "../CubeMapComponent";
import {
  clippingPlanesSignal,
  currentLevelSignal,
  modelingSignal,
  tempElementSignal,
  visibilityStateSignal,
} from "../Signals";
import {LevelSystem} from "../LevelSystem";
import {RendererComponent} from "../RendererComponent";
import {IBimElementType, IStructure} from "./types";
import {createStructureContainer, getDefaultTypes} from "./src";
import {BaseElement, ICategory, WallElement} from "../system";
import {IElement, IElementType, IElementTypeName, IIfcBaseConfig} from "clay";

export class ProjectComponent extends Component<string> implements Disposable {
  static readonly uuid = UUID.ProjectComponent;
  enabled = false;
  private structureContainer!: HTMLDivElement;
  private propertyContainer!: HTMLDivElement;
  readonly modelStructure = "Model Tree";

  get camera() {
    return this.components.tools.get(RendererComponent)?.camera;
  }
  defaultElementTypes!: Record<IElementTypeName, IBimElementType<IElementType>>;

  elements!: Record<ICategory, {[uuid: string]: IElement}>;
  tempElements!: Record<ICategory, BaseElement | null>;
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
    effect(() => {
      if (this.propertyContainer) this.propertyContainer.innerHTML = "";
      tempElementSignal.value = modelingSignal.value
        ? this.tempElements[modelingSignal.value.type]
        : null;
      if (tempElementSignal.value && tempElementSignal.value.container)
        this.propertyContainer.appendChild(tempElementSignal.value.container);
    });
  }
  async dispose() {
    this.structureContainer?.remove();
    (this.structureContainer as any) = null;
    this.propertyContainer?.remove();
    (this.propertyContainer as any) = null;
    for (const key in this.defaultElementTypes) {
      this.defaultElementTypes[key] = null;
    }
    for (const key in this.elements) {
      this.elements[key] = {};
    }
    for (const key in this.tempElements) {
      this.tempElements[key]?.dispose();
      this.tempElements[key] = null;
    }
  }
  get() {
    return ProjectComponent.uuid;
  }
  init(_structure: HTMLDivElement, _property: HTMLDivElement) {
    this.structureContainer = createStructureContainer(this);
    _structure.appendChild(this.structureContainer);
    this.propertyContainer = _property;
  }
  initElement() {
    this.defaultElementTypes = getDefaultTypes(this.components.ifcModel);
    this.elements = {
      Wall: {},
      Floor: {},
      Ceiling: {},
      Roof: {},
      Column: {},
      Door: {},
      Window: {},
      "Structure Beam": {},
      "Structure Column": {},
      "Structure Wall": {},
      "Structure Slab": {},
      "Structure Foundation": {},
      ReinForcement: {},
      Duct: {},
      Pipe: {},
      AirTerminal: {},
    };
    this.tempElements = {
      Wall: new WallElement(
        this.components,
        {
          Name: "SimpleWall 1",
          Description: "",
          ObjectType: "",
        } as IIfcBaseConfig,
        currentLevelSignal.value!
      ),
      Floor: null,
      Ceiling: null,
      Roof: null,
      Column: null,
      Door: null,
      Window: null,
      "Structure Beam": null,
      "Structure Column": null,
      "Structure Wall": null,
      "Structure Slab": null,
      "Structure Foundation": null,
      ReinForcement: null,
      Duct: null,
      Pipe: null,
      AirTerminal: null,
    };
  }
  onVisibility = (_visible: boolean, _structure: IStructure) => {};
}
ToolComponent.libraryUUIDs.add(ProjectComponent.uuid);
