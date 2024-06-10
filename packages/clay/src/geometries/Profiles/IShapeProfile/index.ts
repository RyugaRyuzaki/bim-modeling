import * as THREE from "three";
import {Model} from "../../../base";
import {ArbitraryClosedProfile} from "../ArbitraryClosedProfile";
import {IIfcBaseConfig} from "../../../elements";

export interface IIShapeConfig {
  bw: number;
  hw: number;
  bf: number;
  hf: number;
}

export class IShapeProfile extends ArbitraryClosedProfile {
  height = 0;
  width = 0;

  constructor(model: Model, config: IIShapeConfig) {
    super(model);
    const {bw, hw, hf} = config;
    this.height = hw + hf * 2;
    this.width = bw;
    this.updateProfile(this.updateIShape(config));
  }
  private updateIShape(update: IIShapeConfig) {
    const {bw, hw, bf, hf} = update;
    const points: THREE.Vector3[] = [];
    points.push(new THREE.Vector3(bf / 2, hw / 2 + hf, 0));
    points.push(new THREE.Vector3(bf / 2, hw / 2, 0));
    points.push(new THREE.Vector3(bw / 2, hw / 2, 0));
    points.push(new THREE.Vector3(bw / 2, -hw / 2, 0));
    points.push(new THREE.Vector3(bf / 2, -hw / 2, 0));
    points.push(new THREE.Vector3(bf / 2, -hw / 2 - hf, 0));
    points.push(new THREE.Vector3(-bf / 2, -hw / 2 - hf, 0));
    points.push(new THREE.Vector3(-bf / 2, -hw / 2, 0));
    points.push(new THREE.Vector3(-bw / 2, -hw / 2, 0));
    points.push(new THREE.Vector3(-bw / 2, hw / 2, 0));
    points.push(new THREE.Vector3(-bf / 2, hw / 2, 0));
    points.push(new THREE.Vector3(-bf / 2, hw / 2 + hf, 0));
    points.push(new THREE.Vector3(bf / 2, hw / 2 + hf, 0));
    return points;
  }
  getInfo = () => {
    return {} as IIfcBaseConfig;
  };
}
