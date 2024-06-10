/**
 * @module GeometrySystem
 */

import * as THREE from "three";
import {ILocationArc, ILocationLine} from "@system/geometry/types";
import {getDirection, getLocalVectorOnFace} from "@BimModel/src/utils";

const MAX_POINTS = 10000;
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
    material: THREE.LineBasicMaterial,
    location: ILocationLine
  ): THREE.Line {
    const {start, end} = location;
    const position = this.getPositionLocationFromPoints([start, end]);
    return this.createSegment(material, position, 2);
  }
  static createLocationArc(
    material: THREE.LineBasicMaterial,
    location: ILocationArc
  ): THREE.Line {
    const {start, end, numberSegment} = location;
    if (!start || !end) throw new Error("Missing params");
    const position = this.getPositionLocationFromPoints([start, end]);
    return this.createSegment(material, position, numberSegment);
  }
  static createLocationCircle(
    material: THREE.LineBasicMaterial,
    location: ILocationArc,
    workPlane: THREE.Plane
  ): THREE.Line {
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
    material: THREE.LineBasicMaterial,
    position: number[],
    numberSegment: number
  ): THREE.Line {
    // define a LineGeometry
    const positions = new Float32Array(MAX_POINTS * 3);
    positions.fill(0);
    for (let i = 0; i < position.length; i++) {
      positions[i] = position[i];
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setDrawRange(0, numberSegment);
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(positions), 3)
    );
    // set position from p1, p2
    // create a Line2 object 3D in threeJS
    const segment = new THREE.LineSegments(geometry, material);
    // compute line distance that means allow every moment this line change , color and line width change
    segment.computeLineDistances();
    // scale this to default
    segment.renderOrder = 10;
    return segment;
  }
  static getPointsCircle(
    location: ILocationArc,
    workPlane: THREE.Plane,
    movingPoint: THREE.Vector3,
    isHaft = false
  ) {
    const {radius, center, numberSegment} = location;
    const uVector = getDirection(center, movingPoint);
    const vVector = new THREE.Vector3()
      .crossVectors(workPlane.normal, uVector)
      .normalize();
    const angle0 = (2 * Math.PI) / numberSegment;
    return this.getPointsArc(
      radius,
      center,
      uVector,
      vVector,
      angle0,
      isHaft ? numberSegment / 2 : numberSegment
    );
  }

  static getPointsArc(
    minRadius: number,
    center: THREE.Vector3,
    uVector: THREE.Vector3,
    vVector: THREE.Vector3,
    angle: number,
    numberSegment: number
  ) {
    const points: THREE.Vector3[] = [];

    for (let i = 0; i <= numberSegment; i++) {
      const cos = minRadius * Math.cos(i * angle);
      const sin = minRadius * Math.sin(i * angle);
      const p = center
        .clone()
        .add(uVector.clone().multiplyScalar(cos))
        .add(vVector.clone().multiplyScalar(sin));
      points.push(p);
    }
    const position: number[] = [];
    for (let i = 0; i < points.length; i++) {
      position.push(points[i].x, points[i].y, points[i].z);
      if (i < points.length - 1) {
        position.push(points[i + 1].x, points[i + 1].y, points[i + 1].z);
      }
    }
    return position;
  }
  static getPointsArcFromAngle(
    radius: number,
    p0: THREE.Vector3,
    p: THREE.Vector3,
    normal: THREE.Vector3,
    angleArc: number,
    numberSegment: number
  ) {
    const dir = getDirection(p0, p);
    const per = new THREE.Vector3().crossVectors(normal, dir).normalize();
    const points: THREE.Vector3[] = [];
    points.push(p);

    const angle0 = angleArc / numberSegment;
    for (let i = 0; i < numberSegment; i++) {
      const angle = (i + 1) * angle0;
      const sin = Math.sin(angle);
      const cos = Math.cos(angle);
      const pTemp = p0
        .clone()
        .add(dir.clone().multiplyScalar(cos * radius))
        .add(per.clone().multiplyScalar(sin * radius));
      points.push(pTemp);
    }
    const position: number[] = [];
    for (let i = 0; i < points.length; i++) {
      position.push(points[i].x, points[i].y, points[i].z);
      if (i < points.length - 1) {
        position.push(points[i + 1].x, points[i + 1].y, points[i + 1].z);
      }
    }
    return position;
  }
  static updateLineSegmentPosition(position: number[], segment: THREE.Line) {
    if (!segment) return;
    segment.geometry.setDrawRange(0, position.length / 3);
    const corePositions = segment.geometry.attributes.position.array;
    for (let i = 0; i < position.length; i++) {
      corePositions[i] = position[i];
    }
    segment.computeLineDistances();
    segment.geometry.attributes.position.needsUpdate = true;
  }
}
