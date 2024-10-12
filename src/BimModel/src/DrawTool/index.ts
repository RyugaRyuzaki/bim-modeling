/**
 * @module DrawTool
 */

import * as THREE from "three";
import {
  Components,
  ElementLocation,
  ICategory,
  MovingLine,
  RaycasterComponent,
  SelectionComponent,
} from "@BimModel/src";
import {ToolComponent} from "@BimModel/src/Tool";
import {Component, Disposable, UUID} from "@BimModel/src/types";
import {
  AirTerminal,
  ArchitectColumn,
  ArchitectWall,
  BaseModify,
  Ceiling,
  CurtainWall,
  Door,
  Floor,
  ModifyCopy,
  ModifyMove,
  Pipe,
  ReinForcement,
  Roof,
  StructureBeam,
  StructureColumn,
  StructureFoundation,
  StructureSlab,
  StructureWall,
  Window,
} from "./src";
import {effect} from "@preact/signals-react";
import {
  currentLevelSignal,
  drawingTypeSignal,
  modelingSignal,
  modifySignal,
  tempElementSignal,
} from "@BimModel/src/Signals";
import {ILevel} from "../LevelSystem/types";
import {BaseDrawCategory} from "./src/Draw/BaseDrawCategory";
import {ProfileUtils} from "../ProjectComponent/src";
export class DrawTool extends Component<string> implements Disposable {
  static readonly uuid = UUID.DrawTool;
  static upDirection = new THREE.Vector3(0, 1, 0);
  enabled = false;

  /** @TempDraw */
  workPlane = new THREE.Plane(DrawTool.upDirection, 0);

  /** @draws  */
  //@ts-ignore
  private draws: Record<ICategory, BaseDrawCategory> = {};
  private modifies: {[name: string]: BaseModify} = {};
  set workPlaneLevel(level: ILevel) {
    const {elevation} = level;
    this.workPlane.setFromNormalAndCoplanarPoint(
      DrawTool.upDirection,
      new THREE.Vector3(0, elevation, 0)
    );
  }
  movingLine = new MovingLine(this.components);
  get RaycasterComponent() {
    return this.components.tools.get(RaycasterComponent);
  }
  get SelectionComponent() {
    return this.components.tools.get(SelectionComponent);
  }

  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(DrawTool.uuid, this);
  }
  async dispose() {
    for (const name in this.draws) {
      const draw = this.draws[name];
      draw.setupEvent = false;
      draw.dispose();
    }
    //@ts-ignore
    this.draws = {};
    for (const name in this.modifies) {
      this.modifies[name]?.dispose();
    }
    this.modifies = {};
    this.movingLine?.dispose();
    (this.movingLine as any) = null;
  }

  get() {
    return DrawTool.uuid;
  }
  private initDraws() {
    const profiles = ProfileUtils.createProfiles(this.components.ifcModel);
    this.draws["AirTerminal"] = new AirTerminal(
      this.components,
      this.workPlane,
      "AirTerminal"
    );
    this.draws["Wall"] = new ArchitectWall(
      this.components,
      this.workPlane,
      "Wall"
    );
    this.draws["Column"] = new ArchitectColumn(
      this.components,
      this.workPlane,
      "Column"
    );
    this.draws["Ceiling"] = new Ceiling(
      this.components,
      this.workPlane,
      "Ceiling"
    );
    this.draws["CurtainWall"] = new CurtainWall(
      this.components,
      this.workPlane,
      "CurtainWall"
    );
    this.draws["Door"] = new Door(this.components, this.workPlane, "Door");
    this.draws["Floor"] = new Floor(this.components, this.workPlane, "Floor");
    this.draws["Pipe"] = new Pipe(this.components, this.workPlane, "Pipe");
    this.draws["ReinForcement"] = new ReinForcement(
      this.components,
      this.workPlane,
      "ReinForcement"
    );
    this.draws["Roof"] = new Roof(this.components, this.workPlane, "Roof");
    this.draws["Window"] = new Window(
      this.components,
      this.workPlane,
      "Window"
    );
    const beam = new StructureBeam(
      this.components,
      this.workPlane,
      "Structure Beam"
    );
    beam.initInstance(profiles);
    this.draws["Structure Beam"] = beam;
    this.draws["Structure Column"] = new StructureColumn(
      this.components,
      this.workPlane,
      "Structure Column"
    );
    this.draws["Structure Foundation"] = new StructureFoundation(
      this.components,
      this.workPlane,
      "Structure Foundation"
    );
    this.draws["Structure Slab"] = new StructureSlab(
      this.components,
      this.workPlane,
      "Structure Slab"
    );
    this.draws["Structure Wall"] = new StructureWall(
      this.components,
      this.workPlane,
      "Structure Wall"
    );
  }
  private initModify() {
    this.modifies["Copy"] = new ModifyCopy(this.components);
    this.modifies["Move"] = new ModifyMove(this.components);
  }
  init() {
    this.initDraws();
    this.initModify();
    effect(() => {
      for (const name in this.draws) {
        const draw = this.draws[name] as BaseDrawCategory;
        draw.drawing = drawingTypeSignal.value;
      }
      this.RaycasterComponent!.visibleInfo = drawingTypeSignal.value !== "None";
    });
    effect(() => {
      this.SelectionComponent.setupEvent = modelingSignal.value === null;
      for (const category in this.draws) {
        const draw = this.draws[category] as BaseDrawCategory;
        draw.activeCategory = modelingSignal.value
          ? modelingSignal.value.type
          : null;
      }
    });
    effect(() => {
      for (const name in this.modifies) {
        const modify = this.modifies[name];
        if (modifySignal.value === null) {
          modify.setupEvent = false;
          modify.dispose();
        } else {
          modify.setupEvent = modifySignal.value === name;
        }
      }
      this.SelectionComponent.setupEvent = modifySignal.value === null;
    });
    effect(() => {
      if (!currentLevelSignal.value) return;
      this.workPlaneLevel = currentLevelSignal.value;
    });
  }
}
ToolComponent.libraryUUIDs.add(DrawTool.uuid);
