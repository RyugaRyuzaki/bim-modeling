import {disposeModeling} from "./Modeling";
import {disposeProject} from "./Project";
import {disposeVisibility} from "./Visibility";
import {disposeLevel} from "./Level";
import {disposeKeyboard} from "./Keyboard";
import {disposeClippingPlanes} from "./ClippingPlanes";
import {disposeStructure} from "./Structure";
import {disposeWorkPlane} from "./WorkPlane";
import {disposeElementType} from "./ElementType";
import {disposeAnnotation} from "./Annotation";

export * from "./Modeling";
export * from "./Project";
export * from "./Visibility";
export * from "./Level";
export * from "./Keyboard";
export * from "./ClippingPlanes";
export * from "./Structure";
export * from "./WorkPlane";
export * from "./ElementType";
export * from "./Annotation";

export function disposeSignals() {
  disposeModeling();
  disposeProject();
  disposeVisibility();
  disposeLevel();
  disposeKeyboard();
  disposeClippingPlanes();
  disposeStructure();
  disposeWorkPlane();
  disposeElementType();
  disposeAnnotation();
}
