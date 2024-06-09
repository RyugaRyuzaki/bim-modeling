import {ILevel, IView} from "@BimModel/src/LevelSystem/types";
import {signal} from "@preact/signals-react";

export const currentLevelSignal = signal<ILevel | null>(null);
export const listLevelSignal = signal<ILevel[]>([]);
export const projectBrowserSignal = signal<IView | null>(null);
export const selectViewSignal = signal<IView | null>(null);
export function disposeLevel() {
  currentLevelSignal.value = null;
  listLevelSignal.value = [];
  projectBrowserSignal.value = null;
  selectViewSignal.value = null;
}
