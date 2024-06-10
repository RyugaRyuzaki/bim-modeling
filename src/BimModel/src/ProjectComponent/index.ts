import * as THREE from "three";
import {effect} from "@preact/signals-react";
import {Components} from "../Components";
import {ToolComponent} from "../Tool";
import {Component, Disposable, UUID} from "../types";
import {
  modelingSignal,
  modelStructureSignal,
  tempElementSignal,
} from "../Signals";
import {RendererComponent} from "../RendererComponent";
import {IBimElementType, IStructure} from "./types";
import {createElementContainer} from "./src";
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
import {MaterialComponent} from "../MaterialComponent";
/**
 *
 */
export class ProjectComponent extends Component<string> implements Disposable {
  static readonly uuid = UUID.ProjectComponent;
  enabled = false;
  private propertyContainer!: HTMLDivElement;
  readonly modelStructure = "Model Tree";

  get camera() {
    return this.components.tools.get(RendererComponent)?.camera;
  }
  get materialCategories() {
    return this.components.tools.get(MaterialComponent)?.materialCategories;
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
    this.propertyContainer?.remove();
    (this.propertyContainer as any) = null;
    for (const id in this.elements) {
      this.elements[id].dispose();
    }
    this.elements = {};
    (this.tempElements as any) = {};
  }
  get() {
    return ProjectComponent.uuid;
  }
  init(property: HTMLDivElement) {
    this.propertyContainer = createElementContainer();
    property.appendChild(this.propertyContainer);
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
        fragment.mesh.removeFromParent();
      }
      this.components.modelScene.add(...element.clones);

      const elementLocation = new ElementLocation(category, bimElementTypes);
      elementLocation.element = element;
      elementLocation.location = location;
      if (elementLocation.location instanceof LocationLine) {
        elementLocation.location.onChangeLength =
          elementLocation.onChangeLength;
      }
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
            material: this.materialCategories[type],
            onChangeColor: this.onChangeColor,
          } as IStructure;
      }
    }
    return modelStructure;
  };
  onVisibility = (_visible: boolean, _structure: IStructure) => {};
  onChangeColor = (
    color: string,
    material: THREE.MeshBasicMaterial | null | undefined
  ) => {
    material!.color.set(new THREE.Color(color));
  };
}
ToolComponent.libraryUUIDs.add(ProjectComponent.uuid);
