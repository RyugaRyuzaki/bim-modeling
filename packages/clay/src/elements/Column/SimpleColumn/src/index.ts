import * as THREE from "three";
import {v4 as uuidv4} from "uuid";
import {IFC4X3 as IFC} from "web-ifc";
import {Model} from "../../../../base";
import {IfcUtils} from "../../../../utils";
import {Element} from "../../../Elements";
import {Extrusion, ClayGeometry, Profile} from "../../../../geometries";
import {SimpleColumnType} from "../index";
import {Fragment} from "../../../../fragment";

export class SimpleColumn extends Element {
  attributes: IFC.IfcColumn;

  type: SimpleColumnType;

  body: Extrusion<Profile>;

  height = 3;

  constructor(model: Model, type: SimpleColumnType) {
    super(model, type);
    this.type = type;
    this.body = new Extrusion(model, this.type.profile);
    const id = this.body.attributes.expressID;
    this.type.geometries.set(id, this.body);
    this.geometries.add(id);

    const placement = IfcUtils.localPlacement();
    const shape = IfcUtils.productDefinitionShape(model, [
      this.body.attributes,
    ]);

    this.attributes = new IFC.IfcColumn(
      new IFC.IfcGloballyUniqueId(uuidv4()),
      null,
      null,
      null,
      null,
      placement,
      shape,
      null,
      null
    );

    this.model.set(this.attributes);
  }

  update(updateGeometry = false) {
    this.body.depth = this.height;
    this.body.update();

    const shape = this.model.get(this.attributes.Representation);
    const reps = this.model.get(shape.Representations[0]);
    reps.Items = [this.body.attributes];
    this.model.set(reps);

    this.updateGeometryID();
    super.update(updateGeometry);
  }
  updateLocation = (update: any) => {
    const {point} = update;
    if (!point) return;
    this.position.x = point.x;
    this.position.y = -point.z;
    this.position.z = point.y;
    this.update(true);
    this.updateFragment();
  };
  updateDraw = (update: any) => {
    const {point} = update;
    if (!point) return;
    this.position.x = point.x;
    this.position.y = -point.z;
    this.position.z = point.y;
    this.update(true);
  };
  updateOffsetLevel = (_update: any) => {
    //@ts-ignore
    const {height} = this.type.profile;
    if (!height) return;
    this.body.position.y = -height / 2;
  };
  updateLevel = (_update: any) => {};
  onClone = (material: THREE.MeshLambertMaterial) => {
    const element = this.type.addInstance(material);
    element.position = this.position.clone();
    element.update(true);
    const {fragments, clones} = element.type;
    for (const [id, fragment] of fragments) {
      const clone = Fragment.clone(fragment);
      clones.set(id, clone);
      fragment.mesh.removeFromParent();
    }
    return element;
  };
  private updateGeometryID() {
    const modelID = this.model.modelID;
    const id = this.attributes.expressID;
    this.model.ifcAPI.StreamMeshes(modelID, [id], (ifcMesh) => {
      const newGeometry = ifcMesh.geometries.get(0);
      const newGeomID = newGeometry.geometryExpressID;
      const oldGeomID = this.geometries.values().next().value;

      this.geometries.clear();
      this.geometries.add(newGeomID);

      const frag = this.type.fragments.get(oldGeomID) as Fragment;
      this.type.fragments.delete(oldGeomID);
      this.type.fragments.set(newGeomID, frag);

      const geometry = this.type.geometries.get(oldGeomID) as ClayGeometry;
      this.type.geometries.delete(oldGeomID);
      this.type.geometries.set(newGeomID, geometry);
    });
  }
}
