import {signal} from "@preact/signals-react";

export const keyboardSignal = signal<string | null>(null);
export function disposeKeyboard() {
  keyboardSignal.value = null;
}
