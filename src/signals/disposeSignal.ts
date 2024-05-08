import {disposeProgressSignal} from "./notify";
import {disposeFileType} from "./notify/baseNotify";

export function disposeSignal() {
  disposeProgressSignal();
  disposeFileType();
}
