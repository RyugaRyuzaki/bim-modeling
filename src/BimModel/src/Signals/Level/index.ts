import {signal} from "@preact/signals-react";
import {ILevel} from "@system/08-level/types";

export const currentLevelSignal = signal<ILevel | null>(null);
export const listLevelSignal = signal<ILevel[]>([]);
export function disposeLevel() {
  currentLevelSignal.value = null;
  listLevelSignal.value = [];
}
