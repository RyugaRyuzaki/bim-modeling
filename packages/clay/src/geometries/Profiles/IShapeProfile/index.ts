import * as THREE from "three";
import {IFC4X3 as IFC} from "web-ifc";

import {Model} from "../../../base";
import {ArbitraryClosedProfile} from "../ArbitraryClosedProfile";
import {IIfcBaseConfig} from "../../../elements";
import {Profile} from "..";

export interface IIShapeConfig {
  bw: number;
  hw: number;
  bf: number;
  hf: number;
}

export class IShapeProfile extends Profile {
  attributes: IFC.IfcProfileDef;
  update = () => {
    //
  };
  updateProfile = (update: any) => {
    console.log(update);
  };
  height = 0;
  width = 0;

  constructor(model: Model, config: IIShapeConfig) {
    super(model);
    const {bf, hw, hf, bw} = config;
    this.height = hw + hf * 2;
    this.width = bf;
    const name = `I${this.height}x${this.width}`;
    this.attributes = new IFC.IfcIShapeProfileDef(
      IFC.IfcProfileTypeEnum.AREA,
      new IFC.IfcLabel(name),
      null,
      new IFC.IfcPositiveLengthMeasure(this.width),
      new IFC.IfcPositiveLengthMeasure(this.height),
      new IFC.IfcPositiveLengthMeasure(bw),
      new IFC.IfcPositiveLengthMeasure(hf),
      null,
      null,
      null
    );
    this.model.set(this.attributes);
  }
  // private updateIShape(update: IIShapeConfig) {
  //   const {bw, hw, bf, hf} = update;
  //   const points: THREE.Vector3[] = [];
  //   points.push(new THREE.Vector3(bf / 2, hw / 2 + hf, 0));
  //   points.push(new THREE.Vector3(bf / 2, hw / 2, 0));
  //   points.push(new THREE.Vector3(bw / 2, hw / 2, 0));
  //   points.push(new THREE.Vector3(bw / 2, -hw / 2, 0));
  //   points.push(new THREE.Vector3(bf / 2, -hw / 2, 0));
  //   points.push(new THREE.Vector3(bf / 2, -hw / 2 - hf, 0));
  //   points.push(new THREE.Vector3(-bf / 2, -hw / 2 - hf, 0));
  //   points.push(new THREE.Vector3(-bf / 2, -hw / 2, 0));
  //   points.push(new THREE.Vector3(-bw / 2, -hw / 2, 0));
  //   points.push(new THREE.Vector3(-bw / 2, hw / 2, 0));
  //   points.push(new THREE.Vector3(-bf / 2, hw / 2, 0));
  //   points.push(new THREE.Vector3(-bf / 2, hw / 2 + hf, 0));
  //   points.push(new THREE.Vector3(bf / 2, hw / 2 + hf, 0));
  //   return points;
  // }
  getInfo = () => {
    return {} as IIfcBaseConfig;
  };
}
