import {IFC4X3 as IFC} from "web-ifc";
import * as THREE from "three";
import {ClayObject} from "../../../base";
import {ClayGeometry} from "../../../geometries/Geometry";
import {Element} from "../Element";
import {Fragment} from "../../../fragment/fragment";

export abstract class ElementType<
  T extends Element = Element
> extends ClayObject {
  abstract attributes: IFC.IfcElementType;
  geometries = new Map<number, ClayGeometry>();

  elements = new Map<number, T>();

  fragments = new Map<number, Fragment>();
  clones = new Map<number, Fragment>();

  get typeUuid() {
    return this.attributes!.GlobalId.value;
  }
  get typeName() {
    return this.attributes!.Name!.value || "";
  }

  abstract addInstance(): T;

  abstract deleteInstance(id: number): void;

  protected newFragment(material = this.model.material) {
    const geometry = new THREE.BufferGeometry();
    geometry.setIndex([]);
    const fragment = new Fragment(geometry, material, 0);
    fragment.mesh.frustumCulled = false;
    return fragment;
  }
  dispose() {
    for (const [id, _element] of this.elements) {
      this.deleteInstance(id);
    }
  }
}
