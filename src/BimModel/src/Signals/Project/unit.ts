import {IUnit} from "@BimModel/src/types";
import {effect, signal} from "@preact/signals-react";

export const ListUnits: IUnit[] = ["m", "mm"];
const storageKey = "units";

function getDefaultUnit(): IUnit {
  let unit = window.localStorage.getItem(storageKey) as IUnit;
  if (!unit) unit = "mm" as IUnit;
  return unit;
}

export const unitSignal = signal<IUnit>(getDefaultUnit());
effect(() => {
  window.localStorage.setItem(storageKey, unitSignal.value);
});
