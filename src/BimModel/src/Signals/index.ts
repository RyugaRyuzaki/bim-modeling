import {disposeModeling} from "./Modeling";
import {disposeProject} from "./Project";

export * from "./Modeling";
export * from "./Project";

export function disposeSignals() {
  disposeModeling();
  disposeProject();
}
