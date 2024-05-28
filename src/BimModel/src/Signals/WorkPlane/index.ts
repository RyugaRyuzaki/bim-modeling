import {signal} from "@preact/signals-react";

export const showWorkPlaneSignal = signal<boolean>(false);
export function disposeWorkPlane() {
  showWorkPlaneSignal.value = false;
}
