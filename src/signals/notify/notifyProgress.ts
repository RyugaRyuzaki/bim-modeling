import {signal} from "@preact/signals-react";

export const fileProgressSignal = signal<number | null>(null);
export const geometryProgressSignal = signal<number | null>(null);
export const geometryJsonProgressSignal = signal<number | null>(null);
export const propertyProgressSignal = signal<number | null>(null);

export function disposeProgressSignal() {
  fileProgressSignal.value = null;
  geometryProgressSignal.value = null;
  geometryJsonProgressSignal.value = null;
  propertyProgressSignal.value = null;
}
