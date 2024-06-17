import * as THREE from "three";

import {ILevel} from "./types";
import {v4 as uuidv4} from "uuid";
export const defaultLevels: ILevel[] = [
  {
    name: "Level 1",
    index: 0,
    elevation: 0.0,
    uuid: uuidv4(),
    plane: new THREE.Plane().setFromNormalAndCoplanarPoint(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 0)
    ),
  },
  {
    name: "Level 2",
    index: 1,
    elevation: 4.0,
    uuid: uuidv4(),
    plane: new THREE.Plane().setFromNormalAndCoplanarPoint(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 4.0, 0)
    ),
  },
];
