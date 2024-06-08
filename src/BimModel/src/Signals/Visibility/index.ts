import {IVisibility} from "@ModelingComponent/types";
import {signal} from "@preact/signals-react";

// export const modelings = getAllModelingType();
export const visibilityStateSignal = signal<IVisibility>("3D");
export const openVisibilitySignal = signal<boolean>(false);

export function disposeVisibility() {
  visibilityStateSignal.value = "3D";
  openVisibilitySignal.value = false;
}
