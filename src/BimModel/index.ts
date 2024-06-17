import {
  Components,
  disposeSignals,
  CubeMapComponent,
  MaterialComponent,
  ModelingComponent,
  RendererComponent,
  RaycasterComponent,
  ProjectComponent,
  WorkPlane,
  Snapper,
  DrawTool,
  LevelSystem,
  GridSystem,
  SelectionComponent,
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
    /* =====WorkPlane===== */
    const workPlane = this.components.tools.get(WorkPlane);
    workPlane.enabled = true;
    /* =====Snapper===== */
    const snapper = this.components.tools.get(Snapper);
    snapper.enabled = true;
    /* =====DrawTool===== */
    const drawTool = this.components.tools.get(DrawTool);
    drawTool.enabled = true;

    /* =====LevelSystem===== */
    const levelSystem = this.components.tools.get(LevelSystem);
    levelSystem.enabled = true;
    /* =====GridSystem===== */
    const gridSystem = this.components.tools.get(GridSystem);
    gridSystem.enabled = true;

    /* =====ModelingComponent===== */
    const modelingComponent = this.components.tools.get(ModelingComponent);
    modelingComponent.enabled = true;

    /* =====SelectionComponent===== */
    const selectionComponent = this.components.tools.get(SelectionComponent);
    selectionComponent.enabled = true;
    this.components.ifcModel.init().then(() => {
      projectComponent.init(this.property);
      projectComponent.initElement();
      modelingComponent.init(this.modeling, this.option);
      levelSystem.initView(this.structure);
      gridSystem.init();
    });
    this.components.gameLoop();
  }
}
//
