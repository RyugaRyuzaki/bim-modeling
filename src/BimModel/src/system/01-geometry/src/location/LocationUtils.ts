/**
 * @module GeometrySystem
 */

import * as THREE from "three";
import {Components} from "@BimModel/src";
import {ILocationArc, ILocationLine} from "@system/01-geometry/types";
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";
import {Line2} from "three/examples/jsm/lines/Line2";
import {LineGeometry} from "three/examples/jsm/lines/LineGeometry";
import {getLocalVectorOnFace} from "@BimModel/src/utils";
export class LocationUtils {
  /**
   *
   */
  static colorBaseLine = new THREE.Color().setHSL(
    1,
    1,
    1,
    THREE.SRGBColorSpace
  );
  static getColorArray(numberSegment: number, color: THREE.Color): number[] {
    const {r, g, b} = color;
    const colors: number[] = [];
    for (let i = 0; i < numberSegment; i++) {
      colors.push(r);
      colors.push(g);
      colors.push(b);
    }
    return colors;
  }
  static createLocationLine(
    material: LineMaterial,
    location: ILocationLine
  ): Line2 {
    const {start, end} = location;
    const position = this.getPositionLocationFromPoints([start, end]);
    return this.createSegment(material, position, 2);
  }
  static createLocationArc(
    material: LineMaterial,
    location: ILocationArc
  ): Line2 {
    const {start, end} = location;
    if (!start || !end) throw new Error("Missing params");
    const position = this.getPositionLocationFromPoints([start, end]);
    return this.createSegment(material, position, 2);
  }
  static createLocationCircle(
    material: LineMaterial,
    location: ILocationArc,
    workPlane: THREE.Plane
  ): Line2 {
    const {radius, center, numberSegment} = location;
    const {x, z} = getLocalVectorOnFace(workPlane.normal);
    const angle0 = (2 * Math.PI) / numberSegment;
    const position = this.getPointsArc(
      radius,
      center,
      x,
      z,
      angle0,
      numberSegment
    );
    return this.createSegment(material, position, numberSegment + 1);
  }
  static getPositionLocationFromPoints(points: THREE.Vector3[]): number[] {
    const position: number[] = [];
    for (let i = 0; i < points.length; i++) {
      const {x, y, z} = points[i];
      position.push(x);
      position.push(y);
      position.push(z);
    }
    return position;
  }
  static createSegment(
    material: LineMaterial,
    position: number[],
    numberSegment: number
  ): Line2 {
    const colors = this.getColorArray(numberSegment, this.colorBaseLine);
    // define a LineGeometry
    const geometry = new LineGeometry();
    // set position from p1, p2
    geometry.setPositions(position);
    // set color
    geometry.setColors(colors);
    // create a Line2 object 3D in threeJS
    const segment = new Line2(geometry, material);
    // compute line distance that means allow every moment this line change , color and line width change
    segment.computeLineDistances();
    // scale this to default
    segment.scale.set(1, 1, 1);
    return segment;
  }
  static getPointsCircle(location: ILocationArc, workPlane: THREE.Plane) {
    const {radius, center, numberSegment} = location;
    const {x, z} = getLocalVectorOnFace(workPlane.normal);
    const angle0 = (2 * Math.PI) / numberSegment;
    return this.getPointsArc(radius, center, x, z, angle0, numberSegment);
  }
  static getPointsArc(
    minRadius: number,
    center: THREE.Vector3,
    uVector: THREE.Vector3,
    vVector: THREE.Vector3,
    angle0: number,
    numberSegment: number
  ) {
    const position: number[] = [];
    for (let i = 0; i <= numberSegment; i++) {
      const cos = minRadius * Math.cos(i * angle0);
      const sin = minRadius * Math.sin(i * angle0);
      const p = center
        .clone()
        .add(uVector.clone().multiplyScalar(cos))
        .add(vVector.clone().multiplyScalar(sin));
      position.push(p.x);
      position.push(p.y);
      position.push(p.z);
    }
    return position;
  }
}
