import {
  Components,
  disposeSignals,
  CubeMapComponent,
  MaterialComponent,
  ModelingComponent,
  PropertyComponent,
  RendererComponent,
  RaycasterComponent,
  StructureComponent,
  ProjectComponent,
  SystemComponent,
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

    /* =====MaterialComponent===== */
    const materialManager = this.components.tools.get(MaterialComponent);
    materialManager.enabled = true;

    /* =====ProjectComponent===== */
    const projectComponent = this.components.tools.get(ProjectComponent);
    projectComponent.enabled = true;

    /* =====RendererComponent===== */
    const renderer = this.components.tools.get(RendererComponent);
    renderer.enabled = true;

    /* =====RaycasterComponent===== */
    const raycasterComponent = this.components.tools.get(RaycasterComponent);
    raycasterComponent.enabled = true;

    /* =====CubeMapComponent===== */
    const cubeMapComponent = this.components.tools.get(CubeMapComponent);
    cubeMapComponent.enabled = true;

    /* =====ModelingComponent===== */
    const modelingComponent = this.components.tools.get(ModelingComponent);
    modelingComponent.enabled = true;
    modelingComponent.init(this.modeling, this.option);

    /* =====PropertyComponent===== */
    const propertyComponent = this.components.tools.get(PropertyComponent);
    propertyComponent.enabled = true;

    /* =====StructureComponent===== */
    const structureComponent = this.components.tools.get(StructureComponent);
    structureComponent.enabled = true;
    structureComponent.init(this.structure);

    new SystemComponent(this.components);
    this.components.gameLoop();
  }
}
