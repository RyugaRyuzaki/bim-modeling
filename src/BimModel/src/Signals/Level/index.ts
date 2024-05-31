import {ILevel} from "@BimModel/src/LevelSystem/types";
import {signal} from "@preact/signals-react";

export const currentLevelSignal = signal<ILevel | null>(null);
export const listLevelSignal = signal<ILevel[]>([]);
export function disposeLevel() {
  currentLevelSignal.value = null;
  listLevelSignal.value = [];
}
