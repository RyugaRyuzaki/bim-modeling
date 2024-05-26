import {disposeModeling} from "./Modeling";
import {disposeProject} from "./Project";
import {disposeVisibility} from "./Visibility";
import {disposeLevel} from "./Level";
import {disposeKeyboard} from "./Keyboard";
import {disposeClippingPlanes} from "./ClippingPlanes";

export * from "./Modeling";
export * from "./Project";
export * from "./Visibility";
export * from "./Level";
export * from "./Keyboard";
export * from "./ClippingPlanes";

export function disposeSignals() {
  disposeModeling();
  disposeProject();
  disposeVisibility();
  disposeLevel();
  disposeKeyboard();
  disposeClippingPlanes();
}
