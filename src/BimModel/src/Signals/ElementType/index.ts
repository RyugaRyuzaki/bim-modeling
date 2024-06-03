import {BaseElement} from "@BimModel/src/system";
import {signal} from "@preact/signals-react";

export const openElementTypeSignal = signal<boolean>(false);
export const tempElementSignal = signal<BaseElement | null>(null);

export function disposeElementType() {
  openElementTypeSignal.value = false;
  tempElementSignal.value = null;
}
