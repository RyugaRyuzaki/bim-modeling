import * as THREE from "three";
import {IFC4X3 as IFC} from "web-ifc";
import {Profile} from "../Profile";
import {Model} from "../../../base";
import {IfcUtils} from "../../../utils/ifc-utils";
import {IIfcBaseConfig} from "../../../elements";

export interface IRectangleConfig {
  width: number;
  height: number;
}

export class RectangleProfile extends Profile {
  attributes: IFC.IfcRectangleProfileDef;

  dimension = new THREE.Vector3(1, 1, 0);

  rotation = new THREE.Euler(0, 0, 0);

  position = new THREE.Vector3(0, 0, 0);

  depth = 1;
  get height() {
    return this.dimension.y;
  }
  get width() {
    return this.dimension.x;
  }
  constructor(model: Model) {
    super(model);
    const placement = new IFC.IfcAxis2Placement2D(
      IfcUtils.point(this.position),
      IfcUtils.direction(new THREE.Vector3(1, 0, 0))
    );

    this.attributes = new IFC.IfcRectangleProfileDef(
      IFC.IfcProfileTypeEnum.AREA,
      null,
      placement,
      new IFC.IfcPositiveLengthMeasure(this.dimension.x),
      new IFC.IfcPositiveLengthMeasure(this.dimension.y)
    );

    this.model.set(this.attributes);
  }
  updateProfile = (update: IRectangleConfig) => {
    const {width, height} = update;
    if (width) this.dimension.x = width;
    if (height) this.dimension.y = height;
    this.update();
  };
  update = () => {
    this.attributes.XDim.value = this.dimension.x;
    this.attributes.YDim.value = this.dimension.y;

    this.attributes.Position = new IFC.IfcAxis2Placement2D(
      IfcUtils.point(this.position),
      IfcUtils.direction(new THREE.Vector3(1, 0, 0))
    );

    const placement = this.model.get(this.attributes.Position);

    IfcUtils.setAxis2Placement(
      this.model,
      placement,
      this.position,
      this.rotation
    );

    this.model.set(this.attributes);
  };
  getInfo = () => {
    return {
      Name: `R${this.width}x${this.height}`,
      Description: "",
      ObjectType: `R${this.width}x${this.height}`,
    } as IIfcBaseConfig;
  };
}
