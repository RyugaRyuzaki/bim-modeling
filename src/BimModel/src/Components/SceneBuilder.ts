/**
 * @module Components
 */
import * as THREE from "three";
import {Disposable} from "@BimModel/src/types";

export class SceneBuilder extends THREE.Scene implements Disposable {
  get meshes() {
    return this.children;
  }

  /**
   *
   */
  constructor() {
    super();
  }
  async dispose() {}
}
