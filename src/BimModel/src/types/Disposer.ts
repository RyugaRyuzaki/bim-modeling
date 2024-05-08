import * as THREE from "three";
import {Component} from "./component";
import {Components} from "../Components";
import {ToolComponent} from "../Tool";
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
} from "three-mesh-bvh";
/**
 * A tool to safely remove meshes and geometries from memory to
 * [prevent memory leaks](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects).
 */
export class Disposer extends Component<Set<string>> {
  private _disposedComponents = new Set<string>();

  /** {@link Component.enabled} */
  enabled = true;

  static readonly uuid = "76e9cd8e-ad8f-4753-9ef6-cbc60f7247fe" as const;

  constructor(components: Components) {
    super(components);
    this.components.tools.add(Disposer.uuid, this);
    Disposer.setupBVH();
  }

  /**
   * {@link Component.uuid}.
   * @return the list of UUIDs of deleted components.
   */
  get() {
    return this._disposedComponents;
  }

  /**
   * Removes a mesh, its geometry and its materials from memory. If you are
   * using any of these in other parts of the application, make sure that you
   * remove them from the mesh before disposing it.
   *
   * @param object - the [object](https://threejs.org/docs/#api/en/core/Object3D)
   * to remove.
   *
   * @param materials - whether to dispose the materials of the mesh.
   *
   * @param recursive - whether to recursively dispose the children of the mesh.
   */
  destroy(object: THREE.Object3D, materials = true, recursive = true) {
    object.removeFromParent();
    const item = object as any;
    if (item.dispose) {
      item.dispose();
    }
    this.disposeGeometryAndMaterials(object, materials);
    if (recursive && item.children && item.children.length) {
      this.disposeChildren(item);
    }

    object.children.length = 0;
  }

  /**
   * Disposes a geometry from memory.
   *
   * @param geometry - the
   * [geometry](https://threejs.org/docs/#api/en/core/BufferGeometry)
   * to remove.
   */
  disposeGeometry(geometry: THREE.BufferGeometry) {
    //@ts-ignore
    if (geometry.boundsTree) {
      //@ts-ignore
      geometry.disposeBoundsTree();
    }
    geometry.dispose();
  }

  private disposeGeometryAndMaterials(
    mesh: THREE.Object3D,
    materials: boolean
  ) {
    const item = mesh as any;
    if (item.geometry) {
      this.disposeGeometry(item.geometry);
    }
    if (materials && item.material) {
      Disposer.disposeMaterial(item);
    }
    item.material = [];
    item.geometry = null;
  }

  private disposeChildren(mesh: THREE.Mesh | THREE.LineSegments) {
    for (const child of mesh.children) {
      this.destroy(child as THREE.Mesh);
    }
  }

  private static disposeMaterial(mesh: THREE.Mesh | THREE.LineSegments) {
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        for (const mat of mesh.material) {
          mat.dispose();
        }
      } else {
        mesh.material.dispose();
      }
    }
  }
  private static setupBVH() {
    //@ts-ignore
    THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
    //@ts-ignore
    THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
    THREE.Mesh.prototype.raycast = acceleratedRaycast;
  }
}

ToolComponent.libraryUUIDs.add(Disposer.uuid);
