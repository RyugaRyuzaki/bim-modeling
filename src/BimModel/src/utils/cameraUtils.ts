import * as THREE from "three";
import {INavigation} from "../types";

const near = 1,
  far = 10000,
  distance = 20,
  corner = Math.sqrt(3 * distance * distance);
const max = new THREE.Vector3(corner, corner, corner);
const pos1 = new THREE.Vector3(corner, corner, corner);
const min = new THREE.Vector3(-corner, -corner, -corner);
export const defaultBox = new THREE.Box3(min, max);
export const defaultSphere = () => {
  const center = new THREE.Vector3().lerpVectors(max, min, 0.5);
  return new THREE.Sphere(center, max.distanceTo(min) / 2);
};
export function initPerspectiveCamera(aspect: number): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(45, aspect, near, far);
  camera.position.copy(max);
  camera.lookAt(0, 0, 0);
  return camera;
}
export function initOrthographicCamera(width: number, height: number) {
  const camera = new THREE.OrthographicCamera(
    width / -50,
    width / 50,
    height / 50,
    height / -50,
    -far,
    far
  );
  camera.position.copy(pos1);
  camera.lookAt(0, 0, 0);
  return camera;
}

export function switchPick(
  name: INavigation,
  boundingSphere: THREE.Sphere,
  boundingBox: THREE.Box3
) {
  const {center} = boundingSphere;
  const {max, min} = boundingBox;
  const pos = max.clone();

  switch (name) {
    case "left":
      pos.set(center.x, center.y, max.z);
      break;
    case "right":
      pos.set(center.x, center.y, min.z);
      break;
    case "top":
      pos.set(center.x, max.y, center.z);
      break;
    case "bottom":
      pos.set(center.x, min.y, center.z);
      break;
    case "front":
      pos.set(max.x, center.y, center.z);
      break;
    case "back":
      pos.set(min.x, center.y, center.z);
      break;
    case "left_front":
      pos.set(max.x, center.y, max.z);
      break;
    case "left_back":
      pos.set(min.x, center.y, max.z);
      break;
    case "right_front":
      pos.set(max.x, center.y, min.z);
      break;
    case "right_back":
      pos.set(min.x, center.y, min.z);
      break;
    case "top_left":
      pos.set(center.x, max.y, max.z);
      break;
    case "top_right":
      pos.set(center.x, max.y, min.z);
      break;
    case "top_front":
      pos.set(max.x, max.y, center.z);
      break;
    case "top_back":
      pos.set(min.x, max.y, center.z);
      break;
    case "bottom_left":
      pos.set(center.x, min.y, max.z);
      break;
    case "bottom_right":
      pos.set(center.x, min.y, min.z);
      break;
    case "bottom_front":
      pos.set(max.x, min.y, center.z);
      break;
    case "bottom_back":
      pos.set(min.x, min.y, center.z);
      break;
    case "top_left_front":
      pos.set(max.x, max.y, max.z);
      break;
    case "top_left_back":
      pos.set(min.x, max.y, max.z);
      break;
    case "top_right_front":
      pos.set(max.x, max.y, min.z);
      break;
    case "top_right_back":
      pos.set(min.x, max.y, min.z);
      break;
    case "bottom_left_front":
      pos.set(max.x, min.y, max.z);
      break;
    case "bottom_left_back":
      pos.set(min.x, min.y, max.z);
      break;
    case "bottom_right_front":
      pos.set(max.x, min.y, min.z);
      break;
    case "bottom_right_back":
      pos.set(min.x, min.y, min.z);
      break;
    default:
      break;
  }
  return pos;
}
