import {IUnit, IUnitSymbol} from "@ProjectComponent/types";
import {effect, signal} from "@preact/signals-react";

export const ListUnits: IUnitSymbol[] = ["m", "cm", "mm"];
const storageKey = "units";

function getDefaultUnit(): IUnitSymbol {
  let unit = window.localStorage.getItem(storageKey) as IUnitSymbol;
  if (!unit) unit = "mm" as IUnitSymbol;
  return unit;
}
/**
 *
 */
const defaultUnit = {
  length: {
    factor: 1.0,
    symbol: "m",
    toFixed: 3,
  } as IUnit,
  area: {
    factor: 1.0,
    symbol: "m²",
    toFixed: 3,
  } as IUnit,
  volume: {
    factor: 1.0,
    symbol: "m³",
    toFixed: 3,
  } as IUnit,
};
export const unitSymbolSignal = signal<IUnitSymbol>(getDefaultUnit());
export const lengthUnitSignal = signal<IUnit>(defaultUnit.length);
export const areaUnitSignal = signal<IUnit>(defaultUnit.area);
export const volumeUnitSignal = signal<IUnit>(defaultUnit.volume);
export const toleranceSignal = signal<number>(0.1);
effect(() => {
  window.localStorage.setItem(storageKey, unitSymbolSignal.value);
  switch (unitSymbolSignal.value) {
    case "m":
      lengthUnitSignal.value = defaultUnit.length;
      areaUnitSignal.value = defaultUnit.area;
      volumeUnitSignal.value = defaultUnit.volume;
      break;
    case "cm":
      lengthUnitSignal.value = {
        factor: 100.0,
        symbol: "cm",
        toFixed: 1,
      } as IUnit;
      areaUnitSignal.value = {
        factor: 10000.0,
        symbol: "cm²",
        toFixed: 1,
      } as IUnit;
      volumeUnitSignal.value = {
        factor: 1000000.0,
        symbol: "cm³",
        toFixed: 1,
      } as IUnit;
      break;
    case "mm":
      lengthUnitSignal.value = {
        factor: 1000.0,
        symbol: "mm",
        toFixed: 0,
      } as IUnit;
      areaUnitSignal.value = {
        factor: 1000000.0,
        symbol: "mm²",
        toFixed: 0,
      } as IUnit;
      volumeUnitSignal.value = {
        factor: 100000000.0,
        symbol: "mm³",
        toFixed: 0,
      } as IUnit;
      break;
  }
});
