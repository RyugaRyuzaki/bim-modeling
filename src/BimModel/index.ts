import {
  Components,
  CubeMapComponent,
  disposeSignals,
  MaterialComponent,
  ModelingComponent,
  PropertyComponent,
  RendererComponent,
  StructureComponent,
} from "./src";

export class BimModel {
  private components!: Components;

  /**
   *
   */
  constructor(
    private container: HTMLDivElement,
    private modeling: HTMLDivElement,
    private option: HTMLDivElement,
    private structure: HTMLDivElement,
    private property: HTMLDivElement
  ) {
    this.init();
  }
  async dispose() {
    this.components.dispose();
    disposeSignals();
  }

  private init() {
    this.components = new Components(this.container);
    const materialManager = this.components.tools.get(MaterialComponent);
    materialManager.enabled = true;
    const renderer = this.components.tools.get(RendererComponent);
    renderer.enabled = true;
    const cubeMapComponent = this.components.tools.get(CubeMapComponent);
    cubeMapComponent.enabled = true;
    const modelingComponent = this.components.tools.get(ModelingComponent);
    modelingComponent.enabled = true;
    modelingComponent.init(this.modeling);
    const propertyComponent = this.components.tools.get(PropertyComponent);
    propertyComponent.enabled = true;
    const structureComponent = this.components.tools.get(StructureComponent);
    structureComponent.enabled = true;
    this.components.gameLoop();
  }
}
