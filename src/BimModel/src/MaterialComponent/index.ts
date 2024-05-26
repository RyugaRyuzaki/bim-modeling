import * as THREE from "three";
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";
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
  static readonly exclude = ["LocationMaterial"];
  enabled = false;
  listMaterial: Map<
    string,
    THREE.MeshLambertMaterial | THREE.MeshBasicMaterial | LineMaterial
  > = new Map();
  get LocationMaterial() {
    return this.listMaterial.get("LocationMaterial");
  }
  get() {
    return MaterialComponent.uuid;
  }
  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(MaterialComponent.uuid, this);
    this.addMaterial(
      "LocationMaterial",
      new LineMaterial({
        linewidth: 1, // in world units with size attenuation, pixels otherwise
        vertexColors: true,
        color: 0xfcb603,
        alphaToCoverage: true,
        dashed: false,
        dashScale: 1,
        dashSize: 1,
        gapSize: 1,
        depthTest: false,
      })
    );
    effect(() => {
      for (const [name, mat] of this.listMaterial) {
        if (MaterialComponent.exclude.includes(name)) continue;
        mat.clippingPlanes = clippingPlanesSignal.value;
      }
    });
    effect(() => {
      (this.LocationMaterial as LineMaterial).linewidth =
        lineTypeSignal.value === "thin" ? 0.5 : 3;
    });
  }
  update(_delta?: number): void {
    const {width, height} = this.components.rect;
    (this.LocationMaterial as LineMaterial)?.resolution.set(width, height);
  }
  async dispose() {
    for (const [_, mat] of this.listMaterial) {
      mat.dispose();
    }
    this.listMaterial.clear();
  }

  addMaterial(
    name: string,
    mat: THREE.MeshLambertMaterial | THREE.MeshBasicMaterial | LineMaterial
  ) {
    if (this.listMaterial.has(name))
      throw new Error("Material's name is existed!");
    this.listMaterial.set(name, mat);
  }
}
ToolComponent.libraryUUIDs.add(MaterialComponent.uuid);
