import {IStructure} from "@BimModel/src/ProjectComponent/types";
import {signal} from "@preact/signals-react";
export const modelStructureSignal = signal<IStructure | null>(null);
export function disposeStructure() {
  modelStructureSignal.value = null;
}
