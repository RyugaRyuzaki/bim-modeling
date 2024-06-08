import * as THREE from "three";
import {effect} from "@preact/signals-react";
import {Components} from "../Components";
import {ToolComponent} from "../Tool";
import {Component, Disposable, UUID} from "../types";
import {
  clippingPlanesSignal,
  currentLevelSignal,
  modelingSignal,
  modelStructureSignal,
  tempElementSignal,
  visibilityStateSignal,
} from "../Signals";
import {LevelSystem} from "../LevelSystem";
import {RendererComponent} from "../RendererComponent";
import {IBimElementType, IStructure} from "./types";
import {createElementContainer, createStructureContainer} from "./src";
import {Fragment, IElement, IElementType} from "clay";
import {
  ElementLocation,
  ElementUtils,
  ICategory,
  LocationArc,
  LocationLine,
  LocationPoint,
} from "../system";
import {ModelingTools} from "../ModelingComponent";
/**
 *
 */
export class ProjectComponent extends Component<string> implements Disposable {
  static readonly uuid = UUID.ProjectComponent;
  enabled = false;
  private structureContainer!: HTMLDivElement;
  private propertyContainer!: HTMLDivElement;
  readonly modelStructure = "Model Tree";

  get camera() {
    return this.components.tools.get(RendererComponent)?.camera;
  }
  tempElements!: Record<ICategory, ElementLocation | null>;

  elements: {[id: number]: ElementLocation} = {};
  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(ProjectComponent.uuid, this);

    effect(() => {
      tempElementSignal.value = modelingSignal.value
        ? this.tempElements[modelingSignal.value.type]
        : null;
    });
  }
  async dispose() {
    this.structureContainer?.remove();
    (this.structureContainer as any) = null;
    this.propertyContainer?.remove();
    (this.propertyContainer as any) = null;
    for (const id in this.elements) {
      const {element, location} = this.elements[id];
      location.dispose();
      element.type.dispose();
    }
    this.elements = {};
    (this.tempElements as any) = {};
  }
  get() {
    return ProjectComponent.uuid;
  }
  init(_structure: HTMLDivElement, _property: HTMLDivElement) {
    this.structureContainer = createStructureContainer(this);
    _structure.appendChild(this.structureContainer);
    this.propertyContainer = createElementContainer();
    _property.appendChild(this.propertyContainer);
  }
  initElement() {
    this.tempElements = ElementUtils.createTempElementInstances(
      this.components.ifcModel
    );
    modelStructureSignal.value = this.getDefaultStructure();
  }
  setElement(
    category: ICategory,
    bimElementTypes: IBimElementType<IElementType>,
    element: IElement,
    location: LocationPoint | LocationArc | LocationLine
  ) {
    const id = element.attributes.expressID;
    if (!this.elements[id]) {
      const {fragments, clones} = element.type;
      for (const [id, fragment] of fragments) {
        const clone = Fragment.clone(fragment);
        clones.set(id, clone);
      }
      this.components.modelScene.add(...element.clones);
      const elementLocation = new ElementLocation(category, bimElementTypes);
      elementLocation.element = element;
      elementLocation.location = location;
      this.elements[id] = elementLocation;
    }
    return this.elements[id];
  }
  getDefaultStructure = (): IStructure => {
    const modelStructure: IStructure = {
      name: this.modelStructure,
      uuid: THREE.MathUtils.generateUUID(),
      visible: true,
      children: {},
      onVisibility: this.onVisibility,
    };
    const childrenModelStructure = modelStructure.children;
    for (const tool of ModelingTools) {
      const {discipline, types} = tool;
      if (discipline === "Modify") continue;
      if (!childrenModelStructure[discipline]) {
        const uuid = THREE.MathUtils.generateUUID();
        childrenModelStructure[discipline] = {
          name: discipline,
          uuid: uuid,
          visible: true,
          children: {},
          onVisibility: this.onVisibility,
        } as IStructure;
      }
      const children = childrenModelStructure[discipline].children;
      for (const {type} of types) {
        if (!children[type])
          children[type] = {
            name: type,
            uuid: THREE.MathUtils.generateUUID(),
            visible: true,
            children: {},
            onVisibility: this.onVisibility,
          } as IStructure;
      }
    }
    return modelStructure;
  };
  onVisibility = (_visible: boolean, _structure: IStructure) => {};
}
ToolComponent.libraryUUIDs.add(ProjectComponent.uuid);
