import {signal} from "@preact/signals-react";
import * as THREE from "three";

export const clippingPlanesSignal = signal<THREE.Plane[]>([]);
export function disposeClippingPlanes() {
  clippingPlanesSignal.value = [];
}
