import {
  IDrawType,
  IModelingTab,
  IModelingTool,
  IModify,
} from "@ModelingComponent/types";
import {effect, signal} from "@preact/signals-react";

export const fileTab: IModelingTab = "Files";
export const modifyTab: IModelingTab = "Modify";
/**
 *
 */
export const disciplineSignal = signal<IModelingTab>(fileTab);
export const modelingSignal = signal<IModelingTool | null>(null);
export const drawingTypeSignal = signal<IDrawType>("None");

// when change input length or angle of location
export const changeInputSignal = signal<boolean>(false);

//#region
export const isModelingSignal = signal<boolean>(false);
export const isOrthoSignal = signal<boolean>(true);
export const modifySignal = signal<IModify | null>(null);

//#endregion
effect(() => {
  if (!isModelingSignal.value) {
    modelingSignal.value = null;
    drawingTypeSignal.value = "None";
  }
});

export function disposeModeling() {
  disciplineSignal.value = fileTab;
  modelingSignal.value = null;
  drawingTypeSignal.value = "None";
  isModelingSignal.value = false;
  isOrthoSignal.value = false;
  changeInputSignal.value = false;
  modifySignal.value = null;
}
