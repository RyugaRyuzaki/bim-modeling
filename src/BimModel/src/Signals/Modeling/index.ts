import {IDrawType, IModelingTool} from "@BimModel/src/types";
import {signal} from "@preact/signals-react";

// export const modelings = getAllModelingType();
export const disciplineSignal = signal<string>("Files");
export const modelingSignal = signal<IModelingTool | null>(null);
export const drawingTypeSignal = signal<IDrawType>("None");
export function disposeModeling() {
  disciplineSignal.value = "Files";
  modelingSignal.value = null;
  drawingTypeSignal.value = "None";
}
