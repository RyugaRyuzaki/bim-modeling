import * as THREE from "three";
import {IFC4X3 as IFC} from "web-ifc";
import {Model} from "../../base";
import {Profile} from "../Profiles/Profile";
import {ClayGeometry} from "../Geometry";
import {MathUtils} from "../../utils/math-utils";
import {IfcUtils} from "../../utils/ifc-utils";

export class Revolved<T extends Profile> extends ClayGeometry {
  attributes!:
    | IFC.IfcGeometricRepresentationItem
    | IFC.IfcBooleanClippingResult;
  curve!: IFC.IfcTrimmedCurve;
  core!: IFC.IfcRevolvedAreaSolid;
  trim!: IFC.IfcTrimmedCurve;

  profile: T;

  center = new THREE.Vector3(0, 0, 0);

  radius = 1;

  angle = 0;

  start = new THREE.Vector3(0, 0, 0);

  end = new THREE.Vector3(0, 0, 0);

  rotation = new THREE.Euler();

  direction = new THREE.Vector3(0, 1, 0);
  /**
   *
   * @param model
   * @param profile
   */
  constructor(model: Model, profile: T) {
    super(model);
    this.profile = profile;

    const {dirX, dirZ} = MathUtils.basisFromEuler(this.rotation);
    const placement = new IFC.IfcAxis2Placement3D(
      IfcUtils.point(this.center),
      IfcUtils.direction(dirZ),
      IfcUtils.direction(dirX)
    );

    const direction = IfcUtils.direction(this.direction);
    const point = IfcUtils.point(new THREE.Vector3(this.radius, 0, 0));

    this.core = new IFC.IfcRevolvedAreaSolid(
      profile.attributes,
      placement,
      new IFC.IfcAxis1Placement(point, direction),
      new IFC.IfcPlaneAngleMeasure(this.angle)
    );
    const circle = new IFC.IfcCircle(
      placement,
      new IFC.IfcPositiveLengthMeasure(this.radius)
    );
    this.trim = new IFC.IfcTrimmedCurve(
      circle,
      [],
      [],
      new IFC.IfcBoolean(true),
      IFC.IfcTrimmingPreference.CARTESIAN
    );

    this.attributes = this.core;
    this.update();
  }
  update(): void {
    throw new Error("Method not implemented.");
  }
}
