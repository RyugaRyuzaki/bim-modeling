import {effect, signal} from "@preact/signals-react";
import {INotify} from "@baseTypes/Notify";
import {toast} from "react-toastify";

export const notifySignal = signal<INotify | null>(null);

effect(() => {
  if (!notifySignal.value) return;
  const {success, message, position} = notifySignal.value;
  if (success) {
    toast.success(message, {position, autoClose: 500});
  } else {
    toast.error(message, {position, autoClose: 5000});
  }
});
export function setNotify(message: string, success = true) {
  notifySignal.value = {
    message,
    success,
    position: success ? "top-right" : "top-center",
  } as INotify;
}
export function disposeFileType() {
  notifySignal.value = null;
}
