import * as THREE from "three";
import {IFC4X3 as IFC} from "web-ifc";
import {Element} from "../Element";
import {ElementType} from "../ElementType";

export abstract class DynamicElementType<
  T extends Element
> extends ElementType {
  abstract attributes: IFC.IfcElementType;
  get name() {
    return this.attributes.Name?.value;
  }
  get uuid() {
    return this.attributes.GlobalId?.value;
  }
  addInstance(material = this.model.material): T {
    const element = this.createElement();
    const id = element.attributes.expressID;
    for (const geomID of element.geometries) {
      const fragment = this.newFragment(material);
      const colors = [material.color];
      const transforms = [new THREE.Matrix4().identity()];
      fragment.add([{id, colors, transforms}]);
      this.fragments.set(geomID, fragment);
    }
    element.update(true);
    this.elements.set(id, element);
    return element;
  }
  deleteInstance(id: number) {
    const element = this.elements.get(id);
    if (!element) {
      throw new Error("Element does not exist!");
    }
    this.model.delete(element.attributes, true);
    for (id of element.geometries) {
      const fragment = this.fragments.get(id);
      if (!fragment) {
        throw new Error("Fragment not found!");
      }
      fragment.dispose(false);
      this.fragments.delete(id);

      const geometry = this.geometries.get(id);
      if (!geometry) {
        throw new Error("Geometry not found!");
      }
      geometry.delete();
      this.geometries.delete(id);
      const clone = this.clones.get(id);
      if (!clone) continue;
      clone.dispose();
    }
  }

  update(updateGeometry = false) {
    for (const [_id, element] of this.elements) {
      element.update(updateGeometry);
    }
  }

  protected abstract createElement(): T;
}
