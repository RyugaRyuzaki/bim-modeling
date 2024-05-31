/**
 * @module LevelSystem
 */

import * as THREE from "three";
import {Components} from "@BimModel/src/Components";
import {ToolComponent} from "@BimModel/src/Tool";
import {Component, Disposable, UUID} from "@BimModel/src/types";
import {ILevel} from "./types";
import {
  clippingPlanesSignal,
  currentLevelSignal,
  listLevelSignal,
} from "@BimModel/src/Signals";
import {RendererComponent} from "@BimModel/src/RendererComponent";
import {WorkPlane} from "../WorkPlane";

const defaultLevels: ILevel[] = [
  {
    name: "Level 1",
    index: 0,
    elevation: 0.0,
  },
  {
    name: "Level 2",
    index: 1,
    elevation: 4.0,
  },
];
const upVector = new THREE.Vector3(0, 1, 0);
const downVector = new THREE.Vector3(0, -1, 0);
const upPosition = new THREE.Vector3(0, 0, 0);
const downPosition = new THREE.Vector3(0, 0, 0);
const upPlane = new THREE.Plane();
const downPlane = new THREE.Plane();

export class LevelSystem extends Component<string> implements Disposable {
  static readonly uuid = UUID.LevelSystem;
  enabled = false;
  get renderer() {
    return this.components.tools.get(RendererComponent);
  }
  get workPlane() {
    return this.components.tools.get(WorkPlane);
  }
  get camera() {
    return this.renderer?.camera;
  }
  set level(level: ILevel | null) {
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
  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(LevelSystem.uuid, this);
    this.initDefaultLevel();
  }
  async dispose() {}

  get() {
    return LevelSystem.uuid;
  }
  private initDefaultLevel() {
    listLevelSignal.value = defaultLevels;
    currentLevelSignal.value = listLevelSignal.value[0];
    this.renderer.postProduction.customEffects.excludedMeshes.push(
      this.workPlane.grid
    );
  }
}
ToolComponent.libraryUUIDs.add(LevelSystem.uuid);
