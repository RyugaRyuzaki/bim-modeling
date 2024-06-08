import * as THREE from "three";
import {Components} from "../Components";
import {ToolComponent} from "../Tool";
import {Component, Disposable, Updateable, UUID} from "../types";
import {effect} from "@preact/signals-react";
import {clippingPlanesSignal, lineTypeSignal} from "../Signals";

export class MaterialComponent
  extends Component<string>
  implements Disposable, Updateable
{
  static readonly uuid = UUID.MaterialComponent;
  static readonly exclude = ["LocationMaterial", "DimensionMaterial"];
  static readonly elements = {
    BeamMaterial: 0xfff705,
    ColumnMaterial: 0xfa051d,
    WallMaterial: 0xf7f8fa,
    SlabMaterial: 0xa19598,
  };
  enabled = false;
  listMaterial: Map<
    string,
    THREE.MeshLambertMaterial | THREE.MeshBasicMaterial
  > = new Map();
  get LocationMaterial(): THREE.MeshBasicMaterial {
    return this.listMaterial.get("LocationMaterial") as THREE.MeshBasicMaterial;
  }
  get DimensionMaterial(): THREE.MeshBasicMaterial {
    return this.listMaterial.get(
      "DimensionMaterial"
    ) as THREE.MeshBasicMaterial;
  }
  get BeamMaterial(): THREE.MeshLambertMaterial {
    return this.listMaterial.get("BeamMaterial") as THREE.MeshLambertMaterial;
  }
  get ColumnMaterial(): THREE.MeshLambertMaterial {
    return this.listMaterial.get("ColumnMaterial") as THREE.MeshLambertMaterial;
  }
  get WallMaterial(): THREE.MeshLambertMaterial {
    return this.listMaterial.get("WallMaterial") as THREE.MeshLambertMaterial;
  }
  get SlabMaterial(): THREE.MeshLambertMaterial {
    return this.listMaterial.get("SlabMaterial") as THREE.MeshLambertMaterial;
  }

  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(MaterialComponent.uuid, this);
    this.addMaterial(
      "LocationMaterial",
      new THREE.MeshBasicMaterial({
        color: 0xeb1405,
        depthTest: false,
      })
    );
    this.addMaterial(
      "DimensionMaterial",
      new THREE.MeshBasicMaterial({
        color: 0x0303fc,
        depthTest: false,
      })
    );
    for (const key in MaterialComponent.elements) {
      this.addMaterial(
        key,
        new THREE.MeshLambertMaterial({
          color: MaterialComponent.elements[key],
        })
      );
    }
    effect(() => {
      for (const [name, mat] of this.listMaterial) {
        if (MaterialComponent.exclude.includes(name)) continue;
        mat.clippingPlanes = clippingPlanesSignal.value;
      }
    });
  }
  update(_delta?: number): void {
    const {width, height} = this.components.rect;
    // (this.LocationMaterial as LineMaterial)?.resolution.set(width, height);
    // (this.DimensionMaterial as LineMaterial)?.resolution.set(width, height);
  }
  async dispose() {
    for (const [_, mat] of this.listMaterial) {
      mat.dispose();
    }
    this.listMaterial.clear();
  }
  get() {
    return MaterialComponent.uuid;
  }
  addMaterial(
    name: string,
    mat: THREE.MeshLambertMaterial | THREE.MeshBasicMaterial
  ) {
    if (this.listMaterial.has(name))
      throw new Error("Material's name is existed!");
    this.listMaterial.set(name, mat);
  }
}
ToolComponent.libraryUUIDs.add(MaterialComponent.uuid);
