import * as THREE from "three";
import {CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer";

export function createLabel(css: string): CSS2DObject {
  const div = document.createElement("div");
  div.className = css;
  const label = new CSS2DObject(div);
  label.userData.content = div;
  return label;
}
export function disposeLabel(label: CSS2DObject) {
  if (!label) return;
  label.removeFromParent();
  label.userData.content?.remove();
  (label as any) = null;
}
export function disposeSegment(segment: THREE.Line) {
  if (!segment) return;
  segment?.geometry.dispose();
  (segment!.geometry as any) = null;
  segment?.removeFromParent();
  (segment as any) = null;
}
