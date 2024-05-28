import {IDrawType, IModelingTool} from "@ModelingComponent/types";
import {effect, signal} from "@preact/signals-react";

export const disciplineSignal = signal<string>("Structure");
export const modelingSignal = signal<IModelingTool | null>(null);
export const drawingTypeSignal = signal<IDrawType>("None");

//#region
export const isModelingSignal = signal<boolean>(false);
export const isOrthoSignal = signal<boolean>(true);

//#endregion
effect(() => {
  if (!isModelingSignal.value) {
    modelingSignal.value = null;
    drawingTypeSignal.value = "None";
  }
});

export function disposeModeling() {
  disciplineSignal.value = "Files";
  modelingSignal.value = null;
  drawingTypeSignal.value = "None";
  isModelingSignal.value = false;
  isOrthoSignal.value = false;
}
