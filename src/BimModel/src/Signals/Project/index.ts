import {signal} from "@preact/signals-react";
export * from "./unit";
export const projectSignal = signal<any | null>(null);
export const openProjectInfoSignal = signal<boolean>(false);
export const newProjectInfoSignal = signal<boolean>(false);
export function disposeProject() {
  projectSignal.value = null;
  openProjectInfoSignal.value = false;
  newProjectInfoSignal.value = false;
}
