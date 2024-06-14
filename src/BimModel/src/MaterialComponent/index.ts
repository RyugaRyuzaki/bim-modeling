import * as THREE from "three";
import {Components} from "../Components";
import {ToolComponent} from "../Tool";
import {Component, Disposable, Updateable, UUID} from "../types";
import {effect} from "@preact/signals-react";
import {clippingPlanesSignal, lineTypeSignal} from "../Signals";
import {ICategory} from "../system";

export class MaterialComponent
  extends Component<string>
  implements Disposable, Updateable
{
  static readonly uuid = UUID.MaterialComponent;
  static readonly exclude = ["LocationMaterial", "DimensionMaterial"];

  enabled = false;
  listMaterial: Map<
    string,
    | THREE.MeshLambertMaterial
    | THREE.MeshBasicMaterial
    | THREE.LineBasicMaterial
  > = new Map();
  get LocationMaterial(): THREE.LineBasicMaterial {
    return this.listMaterial.get("LocationMaterial") as THREE.LineBasicMaterial;
  }
  get DimensionMaterial(): THREE.LineBasicMaterial {
    return this.listMaterial.get(
      "DimensionMaterial"
    ) as THREE.LineBasicMaterial;
  }
  get AngleMaterial(): THREE.LineBasicMaterial {
    return this.listMaterial.get("AngleMaterial") as THREE.LineBasicMaterial;
  }

  materialCategories: Record<
    ICategory,
    THREE.MeshLambertMaterial | null | undefined
  > = {
    Wall: new THREE.MeshLambertMaterial({
      color: 0xf7f8fa,
      depthTest: false,
    }),
    Floor: new THREE.MeshLambertMaterial({
      color: 0xa19598,
      depthTest: false,
    }),
    Ceiling: new THREE.MeshLambertMaterial({
      color: 0xa19598,
      depthTest: false,
    }),
    Roof: new THREE.MeshLambertMaterial({
      color: 0xa19598,
      depthTest: false,
    }),
    Column: new THREE.MeshLambertMaterial({
      color: 0xfa051d,
      depthTest: false,
    }),
    Door: new THREE.MeshLambertMaterial({
      color: 0xa19598,
      depthTest: false,
    }),
    Window: new THREE.MeshLambertMaterial({
      color: 0xa19598,
      depthTest: false,
    }),
    CurtainWall: new THREE.MeshLambertMaterial({
      color: 0xa19598,
      depthTest: false,
    }),
    "Structure Beam": new THREE.MeshLambertMaterial({
      color: 0xfff705,
      depthTest: false,
    }),
    "Structure Column": new THREE.MeshLambertMaterial({
      color: 0xfa051d,
      depthTest: false,
    }),
    "Structure Wall": new THREE.MeshLambertMaterial({
      color: 0xf7f8fa,
      depthTest: false,
    }),
    "Structure Slab": new THREE.MeshLambertMaterial({
      color: 0xa19598,
      depthTest: false,
    }),
    "Structure Foundation": new THREE.MeshLambertMaterial({
      color: 0xa19598,
      depthTest: false,
    }),
    ReinForcement: new THREE.MeshLambertMaterial({
      color: 0xa19598,
      depthTest: false,
    }),
    Duct: new THREE.MeshLambertMaterial({
      color: 0xa19598,
      depthTest: false,
    }),
    Pipe: new THREE.MeshLambertMaterial({
      color: 0xa19598,
      depthTest: false,
    }),
    AirTerminal: new THREE.MeshLambertMaterial({
      color: 0xa19598,
      depthTest: false,
    }),
  };
  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(MaterialComponent.uuid, this);
    this.addMaterial(
      "LocationMaterial",
      new THREE.LineBasicMaterial({
        linewidth: 10,
        color: 0xeb1405,
        depthTest: false,
      })
    );
    this.addMaterial(
      "DimensionMaterial",
      new THREE.LineBasicMaterial({
        linewidth: 10,
        color: 0x0303fc,
        depthTest: false,
      })
    );
    this.addMaterial(
      "AngleMaterial",
      new THREE.LineDashedMaterial({
        linewidth: 10,
        color: 0x34fa07,
        depthTest: false,
        scale: 1,
        dashSize: 0.2,
        gapSize: 0.1,
      })
    );

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
    for (const category in this.materialCategories) {
      (this.materialCategories[
        category
      ] as THREE.MeshLambertMaterial)!.dispose();
    }
    (this.materialCategories as any) = {};
  }
  get() {
    return MaterialComponent.uuid;
  }
  addMaterial(
    name: string,
    mat:
      | THREE.MeshLambertMaterial
      | THREE.MeshBasicMaterial
      | THREE.LineBasicMaterial
  ) {
    if (this.listMaterial.has(name))
      throw new Error("Material's name is existed!");
    this.listMaterial.set(name, mat);
  }
}
ToolComponent.libraryUUIDs.add(MaterialComponent.uuid);
