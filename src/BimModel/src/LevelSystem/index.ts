/**
 * @module LevelSystem
 */

import * as THREE from "three";
import {
  Components,
  RendererComponent,
  CubeMapComponent,
  WorkPlane,
  GridSystem,
} from "@BimModel/src";
import {ToolComponent} from "@BimModel/src/Tool";
import {Component, Disposable, UUID} from "@BimModel/src/types";
import {ILevel, IView} from "./types";
import {
  clippingPlanesSignal,
  currentLevelSignal,
  listLevelSignal,
  selectViewSignal,
} from "@BimModel/src/Signals";
import {createStructureContainer, Elevation, Level} from "./src";
import {effect} from "@preact/signals-react";
import {defaultLevels} from "./constants";

const upVector = new THREE.Vector3(0, -1, 0);
const downVector = new THREE.Vector3(0, 1, 0);
const upPosition = new THREE.Vector3(0, 0, 0);
const downPosition = new THREE.Vector3(0, 0, 0);
const upPlane = new THREE.Plane();
const downPlane = new THREE.Plane();

export class LevelSystem extends Component<string> implements Disposable {
  static readonly uuid = UUID.LevelSystem;
  static readonly zero = new THREE.Vector3();
  enabled = false;
  private structureContainer!: HTMLDivElement;

  get RendererComponent() {
    return this.components.tools.get(RendererComponent);
  }
  get CubeMapComponent() {
    return this.components.tools.get(CubeMapComponent);
  }
  get workPlane() {
    return this.components.tools.get(WorkPlane);
  }
  get camera() {
    return this.RendererComponent?.camera;
  }

  elevations: {[elevationType: string]: Elevation} = {};
  levels: {[uuid: string]: Level} = {};

  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(LevelSystem.uuid, this);
    this.initDefaultLevel();
    effect(() => {
      if (!selectViewSignal.value) return;
      const {viewType, level, elevationType} = selectViewSignal.value;
      this.CubeMapComponent.visible = viewType === "3D";
      this.RendererComponent.postProduction.enabled = viewType === "3D";

      switch (viewType) {
        case "3D":
          this.camera!.resetState();
          clippingPlanesSignal.value = [];
          this.CubeMapComponent.onNavigation3D();
          this.onchangeLevel(null);
          break;
        case "Plan":
          this.onchangeLevel(level!);
          break;
        case "Elevation":
          this.camera!.resetState();
          clippingPlanesSignal.value = [];
          this.onchangeLevel(null);
          this.CubeMapComponent.onNavigationElevation(selectViewSignal.value);
          break;
      }
      this.components.tools
        .get(GridSystem)
        .onViewChange(selectViewSignal.value);
      for (const key in this.levels) {
        this.levels[key].elevationType = elevationType;
        this.levels[key].visible = viewType === "Elevation";
      }
      this.components.tools.get(WorkPlane).clipping.visible =
        viewType === "Plan";
    });
    effect(() => {
      for (const level of listLevelSignal.value) {
        if (!this.levels[level.uuid])
          this.levels[level.uuid] = new Level(this.components, level);
      }
    });
  }
  async dispose() {
    this.structureContainer?.remove();
    (this.structureContainer as any) = null;
    for (const key in this.elevations) {
      this.elevations[key].dispose();
    }

    this.elevations = {};
    for (const key in this.levels) {
      this.levels[key].dispose();
    }
    this.levels = {};
  }

  get() {
    return LevelSystem.uuid;
  }
  onchangeLevel(level: ILevel | null) {
    for (const key in this.elevations) {
      this.elevations[key].level = level;
    }
    if (!level) {
      this.workPlane.grid.position.y = 0;
      return;
    }
    if (!this.camera || this.camera.projection) return;
    const {elevation} = level;
    const camera = this.camera.currentCamera as THREE.OrthographicCamera;
    camera.near = 0;
    camera.far = 2;
    upPosition.y = elevation + 1;
    downPosition.y = elevation - 1;
    this.camera.setLookAt(upPosition, downPosition);
    upPlane.setFromNormalAndCoplanarPoint(upVector, upPosition);
    downPlane.setFromNormalAndCoplanarPoint(downVector, downPosition);
    clippingPlanesSignal.value = [upPlane, downPlane];
    this.workPlane.grid.position.y = elevation;
  }
  private initDefaultLevel() {
    listLevelSignal.value = defaultLevels;
    currentLevelSignal.value = listLevelSignal.value[0];
    this.RendererComponent.postProduction.customEffects.excludedMeshes.push(
      this.workPlane.grid
    );
  }
  init(structure: HTMLDivElement) {
    this.structureContainer = createStructureContainer(this);
    structure.appendChild(this.structureContainer);
  }

  private onActiveView = (_view: IView) => {};
  getDefaultView() {
    const project: IView = {
      name: "Project Browsers",
      uuid: THREE.MathUtils.generateUUID(),
      viewType: "Browsers",
      checked: true,
      onActive: this.onActiveView,
      children: {},
    };
    // 3D
    const threeDs = {
      name: "3D",
      uuid: THREE.MathUtils.generateUUID(),
      viewType: "Browsers",
      checked: true,
      onActive: this.onActiveView,
      children: {},
    } as IView;

    const default3D = {
      name: "Default 3D",
      uuid: THREE.MathUtils.generateUUID(),
      viewType: "3D",
      checked: true,
      onActive: this.onActiveView,
      children: {},
    } as IView;
    selectViewSignal.value = default3D;
    threeDs.children[default3D.uuid] = default3D;
    // planes
    const planes = {
      name: "Planes",
      uuid: THREE.MathUtils.generateUUID(),
      viewType: "Browsers",
      checked: true,
      onActive: this.onActiveView,
      children: {},
    } as IView;

    for (let index = 0; index < defaultLevels.length; index++) {
      const level = defaultLevels[index];
      const uuid = THREE.MathUtils.generateUUID();
      planes.children[uuid] = {
        name: level.name,
        uuid: uuid,
        viewType: "Plan",
        checked: true,
        level,
        onActive: this.onActiveView,
        children: {},
      };
    }
    // elevations
    const elevations = {
      name: "Elevations",
      uuid: THREE.MathUtils.generateUUID(),
      viewType: "Browsers",
      checked: true,
      onActive: this.onActiveView,
      children: {},
    } as IView;

    const South = {
      name: "South",
      uuid: THREE.MathUtils.generateUUID(),
      viewType: "Elevation",
      checked: true,
      onActive: this.onActiveView,
      elevationType: "South",
      children: {},
    } as IView;
    this.elevations["South"] = new Elevation(this.components, South);
    elevations.children[South.uuid] = South;
    const West = {
      name: "West",
      uuid: THREE.MathUtils.generateUUID(),
      viewType: "Elevation",
      checked: true,
      onActive: this.onActiveView,
      elevationType: "West",
      children: {},
    } as IView;
    elevations.children[West.uuid] = West;
    this.elevations["West"] = new Elevation(this.components, West);
    const East = {
      name: "East",
      uuid: THREE.MathUtils.generateUUID(),
      viewType: "Elevation",
      checked: true,
      onActive: this.onActiveView,
      elevationType: "East",
      children: {},
    } as IView;
    elevations.children[East.uuid] = East;
    this.elevations["East"] = new Elevation(this.components, East);
    const North = {
      name: "North",
      uuid: THREE.MathUtils.generateUUID(),
      viewType: "Elevation",
      checked: true,
      onActive: this.onActiveView,
      children: {},
      elevationType: "North",
    } as IView;
    elevations.children[North.uuid] = North;
    this.elevations["North"] = new Elevation(this.components, North);

    project.children[threeDs.uuid] = threeDs;
    project.children[planes.uuid] = planes;
    project.children[elevations.uuid] = elevations;
    return project;
  }
}
ToolComponent.libraryUUIDs.add(LevelSystem.uuid);
