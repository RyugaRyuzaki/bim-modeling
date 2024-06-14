import {ElementLocation} from "@BimModel/src/system";
import {effect, signal} from "@preact/signals-react";
import {disciplineSignal} from "../Modeling";

export const openElementTypeSignal = signal<boolean>(false);
export const tempElementSignal = signal<ElementLocation | null>(null);
export const selectElementSignal = signal<ElementLocation | null>(null);

/**
 *
 */
effect(() => {
  if (selectElementSignal.value) disciplineSignal.value = "Modify";
});

export function disposeElementType() {
  openElementTypeSignal.value = false;
  tempElementSignal.value = null;
  selectElementSignal.value = null;
}
