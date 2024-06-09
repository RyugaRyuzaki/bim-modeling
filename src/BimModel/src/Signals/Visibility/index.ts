import {signal} from "@preact/signals-react";

export const openVisibilitySignal = signal<boolean>(false);

export function disposeVisibility() {
  openVisibilitySignal.value = false;
}
