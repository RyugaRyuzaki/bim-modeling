import {IVisibility} from "@ModelingComponent/types";
import {signal} from "@preact/signals-react";

// export const modelings = getAllModelingType();
export const visibilityStateSignal = signal<IVisibility>("3D");

export function disposeVisibility() {
  visibilityStateSignal.value = "3D";
}
