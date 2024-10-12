import {computed, signal} from "@preact/signals-react";
import {selectViewSignal} from "../Level";

export const showWorkPlaneSignal = signal<boolean>(false);
export const showGridLabelSignal = computed<boolean>(() => {
  return (
    showWorkPlaneSignal.value &&
    selectViewSignal.value !== null &&
    selectViewSignal.value.viewType === "Plan"
  );
});
export function disposeWorkPlane() {
  showWorkPlaneSignal.value = false;
}
