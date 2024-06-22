import {IGrid} from "@BimModel/src/GridSystem/types";
import {signal} from "@preact/signals-react";

export const showAnnotationPanelSignal = signal<boolean>(false);
export const gridXSignal = signal<IGrid[]>([]);
export const gridYSignal = signal<IGrid[]>([]);
export const deleteGridSignal = signal<IGrid | null>(null);

export function disposeAnnotation() {
  showAnnotationPanelSignal.value = false;
  gridXSignal.value = [];
  gridYSignal.value = [];
  deleteGridSignal.value = null;
}
