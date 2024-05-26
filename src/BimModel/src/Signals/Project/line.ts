import {ILineType} from "@ProjectComponent/types";
import {effect, signal} from "@preact/signals-react";

export const ListLineTypes: ILineType[] = ["thin", "thickness"];
const storageKey = "lines";

function getDefaultLineType(): ILineType {
  let unit = window.localStorage.getItem(storageKey) as ILineType;
  if (!unit) unit = "thin" as ILineType;
  return unit;
}

export const lineTypeSignal = signal<ILineType>(getDefaultLineType());
effect(() => {
  window.localStorage.setItem(storageKey, lineTypeSignal.value);
});
