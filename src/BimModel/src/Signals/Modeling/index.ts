import {IDrawType, IModelingTool} from "@ModelingComponent/types";
import {effect, signal} from "@preact/signals-react";

// export const modelings = getAllModelingType();
export const disciplineSignal = signal<string>("Files");
export const modelingSignal = signal<IModelingTool | null>(null);
export const drawingTypeSignal = signal<IDrawType>("None");

//#region
export const isModelingSignal = signal<boolean>(false);
export const isOrthoSignal = signal<boolean>(false);

//#endregion
effect(() => {
  if (!isModelingSignal.value) modelingSignal.value = null;
});

export function disposeModeling() {
  disciplineSignal.value = "Files";
  modelingSignal.value = null;
  drawingTypeSignal.value = "None";
  isModelingSignal.value = false;
  isOrthoSignal.value = false;
}
