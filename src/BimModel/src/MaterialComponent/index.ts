import * as THREE from "three";
import {Components} from "../Components";
import {ToolComponent} from "../Tool";
import {Component, Disposable, Updateable, UUID} from "../types";
import {effect} from "@preact/signals-react";
import {clippingPlanesSignal, lineTypeSignal} from "../Signals";
import {ICategory} from "../system";

import {LineMaterial} from "three/examples/jsm/lines/LineMaterial.js";

export class MaterialComponent
  extends Component<string>
  implements Disposable, Updateable
{
  static readonly uuid = UUID.MaterialComponent;
  static readonly exclude = [
    "LocationMaterial",
    "DimensionMaterial",
    "ClippingMaterial",
  ];

  enabled = false;
  listMaterial: Map<
    string,
    | THREE.MeshLambertMaterial
    | THREE.MeshBasicMaterial
    | THREE.LineBasicMaterial
    | LineMaterial
  > = new Map();
  get ClippingMaterial(): LineMaterial {
    return this.listMaterial.get("ClippingMaterial") as LineMaterial;
  }
  get LocationMaterial(): THREE.LineBasicMaterial {
    return this.listMaterial.get("LocationMaterial") as THREE.LineBasicMaterial;
  }
  get DimensionMaterial(): THREE.LineBasicMaterial {
    return this.listMaterial.get(
      "DimensionMaterial"
    ) as THREE.LineBasicMaterial;
  }
  get AngleMaterial(): THREE.LineDashedMaterial {
    return this.listMaterial.get("AngleMaterial") as THREE.LineDashedMaterial;
  }
  get GridMaterial(): THREE.LineDashedMaterial {
    return this.listMaterial.get("GridMaterial") as THREE.LineDashedMaterial;
  }
  get GridOutlineMaterial(): THREE.LineDashedMaterial {
    return this.listMaterial.get(
      "GridOutlineMaterial"
    ) as THREE.LineDashedMaterial;
  }

  materialCategories: Record<
    ICategory,
    THREE.MeshLambertMaterial | null | undefined
  > = {
    Wall: new THREE.MeshLambertMaterial({
      color: 0xf7f8fa,
    }),
    Floor: new THREE.MeshLambertMaterial({
      color: 0xa19598,
    }),
    Ceiling: new THREE.MeshLambertMaterial({
      color: 0xa19598,
    }),
    Roof: new THREE.MeshLambertMaterial({
      color: 0xa19598,
    }),
    Column: new THREE.MeshLambertMaterial({
      color: 0xfa051d,
    }),
    Door: new THREE.MeshLambertMaterial({
      color: 0xa19598,
    }),
    Window: new THREE.MeshLambertMaterial({
      color: 0xa19598,
    }),
    CurtainWall: new THREE.MeshLambertMaterial({
      color: 0xa19598,
    }),
    "Structure Beam": new THREE.MeshLambertMaterial({
      color: 0xfff705,
    }),
    "Structure Column": new THREE.MeshLambertMaterial({
      color: 0xfa051d,
    }),
    "Structure Wall": new THREE.MeshLambertMaterial({
      color: 0xf7f8fa,
    }),
    "Structure Slab": new THREE.MeshLambertMaterial({
      color: 0xa19598,
    }),
    "Structure Foundation": new THREE.MeshLambertMaterial({
      color: 0xa19598,
    }),
    ReinForcement: new THREE.MeshLambertMaterial({
      color: 0xa19598,
    }),
    Duct: new THREE.MeshLambertMaterial({
      color: 0xa19598,
    }),
    Pipe: new THREE.MeshLambertMaterial({
      color: 0xa19598,
    }),
    AirTerminal: new THREE.MeshLambertMaterial({
      color: 0xa19598,
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
    this.addMaterial(
      "GridMaterial",
      new THREE.LineDashedMaterial({
        linewidth: 10,
        color: 0x121211,
        depthTest: false,
        scale: 1,
        dashSize: 1,
        gapSize: 0.2,
      })
    );
    this.addMaterial(
      "GridOutlineMaterial",
      new THREE.LineDashedMaterial({
        linewidth: 10,
        color: 0xeb1405,
        depthTest: false,
        scale: 1,
        dashSize: 0.4,
        gapSize: 0.2,
      })
    );
    this.addMaterial(
      "ClippingMaterial",
      new LineMaterial({
        linewidth: 2, // in world units with size attenuation, pixels otherwise
        vertexColors: true,
        color: 0xfcb603,
        alphaToCoverage: true,
      })
    );

    effect(() => {
      for (const [name, mat] of this.listMaterial) {
        if (MaterialComponent.exclude.includes(name)) continue;
        mat.clippingPlanes = clippingPlanesSignal.value;
      }
      for (const [_name, mat] of Object.entries(this.materialCategories)) {
        mat!.clippingPlanes = clippingPlanesSignal.value;
      }
    });

    effect(() => {
      const type = lineTypeSignal.value;
      if (!this.ClippingMaterial) return;
      this.ClippingMaterial.linewidth = type === "thin" ? 2 : 6;
    });
  }
  update(_delta?: number): void {
    const {width, height} = this.components.rect;
    (this.ClippingMaterial as LineMaterial)?.resolution.set(width, height);
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
      | LineMaterial
  ) {
    if (this.listMaterial.has(name))
      throw new Error("Material's name is existed!");
    this.listMaterial.set(name, mat);
  }
}
ToolComponent.libraryUUIDs.add(MaterialComponent.uuid);
