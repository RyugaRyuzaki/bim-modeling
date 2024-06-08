import {ElementLocation} from "@BimModel/src/system";
import {signal} from "@preact/signals-react";

export const openElementTypeSignal = signal<boolean>(false);
export const tempElementSignal = signal<ElementLocation | null>(null);
export const selectElementSignal = signal<ElementLocation | null>(null);

export function disposeElementType() {
  openElementTypeSignal.value = false;
  tempElementSignal.value = null;
  selectElementSignal.value = null;
}
