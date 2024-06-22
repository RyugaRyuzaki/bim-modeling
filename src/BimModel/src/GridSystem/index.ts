/**
 * @module GridSystem
 */
import * as THREE from "three";
import {
  Components,
  CubeMapComponent,
  deleteGridSignal,
  Grid,
  gridXSignal,
  gridYSignal,
  LevelSystem,
  listLevelSignal,
  selectViewSignal,
} from "@BimModel/src";
import {ToolComponent} from "@BimModel/src/Tool";
import {Component, Disposable, UUID} from "@BimModel/src/types";
import {IGrid, IGridAxis} from "./types";
import {IView} from "../LevelSystem/types";
import {effect} from "@preact/signals-react";

/**
 *
 */
export * from "./src";
/**
 *
 */
export class GridSystem extends Component<string> implements Disposable {
  static readonly uuid = UUID.GridSystem;
  enabled = false;

  get LevelSystem() {
    return this.components.tools.get(LevelSystem);
  }
  get elevations() {
    return this.LevelSystem.elevations;
  }
  get boundingBox() {
    return this.components.tools.get(CubeMapComponent).box;
  }

  get elevation(): {top: number; bottom: number} | null {
    const bottom = listLevelSignal.value[0];
    if (listLevelSignal.value.length === 1)
      return {top: bottom.elevation + 4, bottom: bottom.elevation - 4};
    const top = listLevelSignal.value[listLevelSignal.value.length - 1];
    if (!bottom || !top) return null;
    return {top: top.elevation + 4, bottom: bottom.elevation - 4};
  }
  gridX: {[uuid: string]: Grid} = {};
  gridY: {[uuid: string]: Grid} = {};

  get segments() {
    const lines: THREE.Line[] = [];
    for (const uuid in this.gridX) {
      const line = this.gridX[uuid].segment;
      if (!line || !line.parent) continue;
      lines.push(line);
    }
    for (const uuid in this.gridY) {
      const line = this.gridY[uuid].segment;
      if (!line || !line.parent) continue;
      lines.push(line);
    }
    return lines;
  }
  get intersects() {
    const points: THREE.Vector3[] = [];
    for (const uuid in this.gridX) {
      const z = this.gridX[uuid].gridItem.coordinate;
      for (const uuid in this.gridY) {
        const x = this.gridY[uuid].gridItem.coordinate;
        points.push(new THREE.Vector3(x, 0, z));
      }
    }
    return points;
  }
  /**
   *
   * @param components
   */
  constructor(components: Components) {
    super(components);
    effect(() => {
      for (const grid of gridXSignal.value) {
        if (!this.gridX[grid.uuid]) {
          this.gridX[grid.uuid] = new Grid(components, grid);
        }
        this.gridX[grid.uuid].gridItem = grid;
        this.onViewChangeItem(this.gridX[grid.uuid]);
      }
    });
    effect(() => {
      for (const grid of gridYSignal.value) {
        if (!this.gridY[grid.uuid]) {
          this.gridY[grid.uuid] = new Grid(components, grid);
        }
        this.gridY[grid.uuid].gridItem = grid;
        this.onViewChangeItem(this.gridY[grid.uuid]);
      }
    });
    effect(() => {
      if (!deleteGridSignal.value) return;
      const uuid = deleteGridSignal.value.uuid;
      if (this.gridX[uuid]) {
        this.gridX[uuid].dispose();
        delete this.gridX[uuid];
      }
      if (this.gridY[uuid]) {
        this.gridY[uuid].dispose();
        delete this.gridY[uuid];
      }
    });
  }
  async dispose() {
    for (const uuid in this.gridX) {
      this.gridX[uuid].dispose();
    }
    this.gridX = {};
    for (const uuid in this.gridY) {
      this.gridY[uuid].dispose();
    }
    this.gridY = {};
  }
  init() {
    gridXSignal.value = this.initGrid("X");
    gridYSignal.value = this.initGrid("Y");
  }
  onViewChange(view: IView) {
    const {elevationType} = view;
    const elevation = elevationType ? this.elevations[elevationType] : null;

    for (const uuid in this.gridX) {
      this.gridX[uuid].onViewChange(view, elevation);
    }
    for (const uuid in this.gridY) {
      this.gridY[uuid].onViewChange(view, elevation);
    }
  }
  onViewChangeItem(grid: Grid) {
    if (!selectViewSignal.value) return;
    const {elevationType} = selectViewSignal.value;
    const elevation = elevationType ? this.elevations[elevationType] : null;
    grid.onViewChange(selectViewSignal.value, elevation);
  }

  private initGrid(axis: IGridAxis) {
    const delta = 4;
    const origin = -2 * delta;
    const number = 5;
    const grids: IGrid[] = [];
    const {max, min} = this.boundingBox;
    for (let i = 0; i < number; i++) {
      const coordinate = origin + i * delta;
      let length = 0;
      if (axis === "Y") {
        length = Math.max(Math.abs(max.x), Math.abs(min.x));
      } else {
        length = Math.max(Math.abs(max.z), Math.abs(min.z));
      }
      grids.push({
        name: `${axis}${i + 1}`,
        axis,
        coordinate,
        length,
        uuid: THREE.MathUtils.generateUUID(),
      } as IGrid);
    }
    return grids;
  }
  get() {
    return GridSystem.uuid;
  }
}
ToolComponent.libraryUUIDs.add(GridSystem.uuid);
