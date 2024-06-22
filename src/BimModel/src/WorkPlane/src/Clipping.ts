import * as THREE from "three";
import {FragmentMesh, IElement} from "clay";
import {
  clippingPlanesSignal,
  Components,
  Disposable,
  MaterialComponent,
  ProjectComponent,
} from "@BimModel/src";
import {LineGeometry} from "three/examples/jsm/lines/LineGeometry";
import {Line2} from "three/examples/jsm/lines/Line2";
import {effect} from "@preact/signals-react";
import {LocationUtils} from "@BimModel/src/system/geometry/location/LocationUtils";

/**
 *
 */
export class Clipping implements Disposable {
  get MaterialComponent() {
    return this.components.tools.get(MaterialComponent);
  }
  get ClippingMaterial() {
    return this.MaterialComponent?.ClippingMaterial;
  }
  get elements() {
    return this.components.tools.get(ProjectComponent).elements;
  }
  get scene() {
    return this.components.clippingScene;
  }
  private _visible = false;

  set visible(visible: boolean) {
    if (this._visible === visible) return;
    this._visible = visible;
    if (visible) {
      this.components.scene.add(this.scene);
    } else {
      this.scene.removeFromParent();
    }
  }
  get visible() {
    return this._visible;
  }
  protected _inverseMatrix = new THREE.Matrix4();
  protected _localPlane = new THREE.Plane();
  protected _tempLine = new THREE.Line3();
  protected _tempVector = new THREE.Vector3();
  private edges: {[uuid: string]: Line2} = {};
  /**
   *
   */
  constructor(private components: Components) {
    effect(() => {
      const planes = clippingPlanesSignal.value;
      this.update(planes);
    });
  }
  async dispose() {
    this.disposeEdge();
  }
  private disposeEdge() {
    for (const id in this.edges) {
      this.disposeEdgeItem(this.edges[id]);
    }
    this.edges = {};
  }
  private disposeEdgeItem(edge: Line2) {
    edge.geometry?.dispose();
    (edge.geometry as any) = null;
    edge.removeFromParent();
    (edge as any) = null;
  }
  update(planes: THREE.Plane[]) {
    this.disposeEdge();
    if (planes.length === 0) return;
    // for (const plane of planes) {
    //   this.drawEdges(plane);
    // }
  }
  private drawEdges(plane: THREE.Plane) {
    for (const id in this.elements) {
      const {element} = this.elements[id];
      if (!element) continue;
      this.drawElementEdges(plane, element);
    }
  }
  private drawElementEdges(plane: THREE.Plane, element: IElement) {
    const posAttr: number[] = [];
    for (const clone of element.clones) {
      if (clone.count === 0) {
        continue;
      }
      for (let i = 0; i < clone.count; i++) {
        const tempMesh = new THREE.Mesh(clone.geometry);
        tempMesh.matrix.copy(clone.matrix);

        const tempMatrix = new THREE.Matrix4();
        clone.getMatrixAt(i, tempMatrix);
        tempMesh.applyMatrix4(tempMatrix);
        tempMesh.applyMatrix4(clone.matrix);
        tempMesh.updateMatrix();
        tempMesh.updateMatrixWorld();

        this._inverseMatrix.copy(tempMesh.matrixWorld).invert();
        this._localPlane.copy(plane).applyMatrix4(this._inverseMatrix);

        this.shapecast(tempMesh, posAttr);
      }
    }
    if (posAttr.length === 0) return;
    if (!this.edges[element.uuid])
      this.edges[element.uuid] = LocationUtils.createClippingLine(
        this.ClippingMaterial,
        posAttr
      );
    this.scene.add(this.edges[element.uuid]);
  }
  private shapecast(mesh: THREE.Mesh, posAttr: number[]) {
    // @ts-ignore
    mesh.geometry.boundsTree.shapecast({
      intersectsBounds: (box: any) => {
        return this._localPlane.intersectsBox(box) as any;
      },

      // @ts-ignore
      intersectsTriangle: (tri: any) => {
        // check each triangle edge to see if it intersects with the plane. If so then
        // add it to the list of segments.
        this._tempLine.start.copy(tri.a);
        this._tempLine.end.copy(tri.b);
        if (this._localPlane.intersectLine(this._tempLine, this._tempVector)) {
          const result = this._tempVector.applyMatrix4(mesh.matrixWorld);
          posAttr.push(result.x, result.y, result.z);
        }

        this._tempLine.start.copy(tri.b);
        this._tempLine.end.copy(tri.c);
        if (this._localPlane.intersectLine(this._tempLine, this._tempVector)) {
          const result = this._tempVector.applyMatrix4(mesh.matrixWorld);
          posAttr.push(result.x, result.y, result.z);
        }

        this._tempLine.start.copy(tri.c);
        this._tempLine.end.copy(tri.a);
        if (this._localPlane.intersectLine(this._tempLine, this._tempVector)) {
          const result = this._tempVector.applyMatrix4(mesh.matrixWorld);
          posAttr.push(result.x, result.y, result.z);
        }
      },
    });
  }
}
