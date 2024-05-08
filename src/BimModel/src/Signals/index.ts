import {disposeModeling} from "./Modeling";

export * from "./Modeling";

export function disposeSignals() {
  disposeModeling();
}
