import * as THREE from "three";
import {v4 as uuidv4} from "uuid";
import {IFC4X3 as IFC} from "web-ifc";
import {Model} from "../../../../base";
import {IfcUtils} from "../../../../utils/ifc-utils";
import {Element} from "../../../Elements";
import {
  Extrusion,
  Profile,
  RectangleProfile,
  ClayGeometry,
} from "../../../../geometries";
import {Fragment} from "../../../../fragment";
import {SimpleBeamType} from "..";
export class SimpleBeam extends Element {
  attributes: IFC.IfcElement;

  type: SimpleBeamType;
  body: Extrusion<Profile>;

  startPoint = new THREE.Vector3(0, 0, 0);

  endPoint = new THREE.Vector3(1, 0, 0);

  get length() {
    return this.startPoint.distanceTo(this.endPoint);
  }

  get midPoint() {
    return new THREE.Vector3(
      (this.startPoint.x + this.endPoint.x) / 2,
      (this.startPoint.y + this.endPoint.y) / 2,
      (this.startPoint.z + this.endPoint.z) / 2
    );
  }

  get direction() {
    const vector = new THREE.Vector3();
    vector.subVectors(this.endPoint, this.startPoint);
    vector.normalize();
    return vector;
  }

  constructor(model: Model, type: SimpleBeamType) {
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

    this.attributes = new IFC.IfcWall(
      new IFC.IfcGloballyUniqueId(uuidv4()),
      this.model.IfcOwnerHistory,
      null,
      null,
      null,
      placement,
      shape,
      null,
      null
    );
    this.rotation.x = Math.PI / 2;
    this.position = this.startPoint;
    this.model.set(this.attributes);
  }

  update(updateGeometry = false) {
    this.body.updateBeam(this.length, this.direction);
    const shape = this.model.get(this.attributes.Representation);
    const reps = this.model.get(shape.Representations[0]);
    reps.Items = [this.body.attributes];
    this.model.set(reps);

    this.updateGeometryID();
    super.update(updateGeometry);
  }
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
