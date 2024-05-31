import {ElementTypeSystem} from "@BimModel/src/system";
import {
  WallType,
  BeamType,
  ColumnType,
  SlabType,
  FoundationType,
  ReinforcementType,
} from "@system/element-type";
import {signal} from "@preact/signals-react";
export const openElementTypeSignal = signal<boolean>(false);
/**===WallType=== */
export const wallTypesSignal = signal<WallType[]>(
  ElementTypeSystem.createWallInstance()
);
export const beamTypesSignal = signal<BeamType[]>(
  ElementTypeSystem.createBeamInstance()
);
export const columnTypesSignal = signal<ColumnType[]>(
  ElementTypeSystem.createColumnInstance()
);
export const slabTypesSignal = signal<SlabType[]>(
  ElementTypeSystem.createSlabInstance()
);
export const foundationTypesSignal = signal<FoundationType[]>(
  ElementTypeSystem.createFoundationInstance()
);
export const reinforcementTypesSignal = signal<ReinforcementType[]>(
  ElementTypeSystem.createReinforcementInstance()
);

export const selectedWallTypeSignal = signal<WallType | null>(
  wallTypesSignal.value[0]
);
export const selectedBeamTypeSignal = signal<BeamType | null>(
  beamTypesSignal.value[0]
);
export const selectedColumnTypeSignal = signal<ColumnType | null>(
  columnTypesSignal.value[0]
);
export const selectedSlabTypeSignal = signal<SlabType | null>(
  slabTypesSignal.value[0]
);
export const selectedFoundationTypeSignal = signal<FoundationType | null>(
  foundationTypesSignal.value[0]
);
export const selectedReinforcementTypeSignal = signal<ReinforcementType | null>(
  reinforcementTypesSignal.value[0]
);

export const elementTypesSignal = signal<
  | WallType[]
  | BeamType[]
  | ColumnType[]
  | SlabType[]
  | FoundationType[]
  | ReinforcementType[]
>([]);

export function disposeElementType() {
  openElementTypeSignal.value = false;
  wallTypesSignal.value = ElementTypeSystem.createWallInstance();
  beamTypesSignal.value = ElementTypeSystem.createBeamInstance();
  columnTypesSignal.value = ElementTypeSystem.createColumnInstance();
  slabTypesSignal.value = ElementTypeSystem.createSlabInstance();
  foundationTypesSignal.value = ElementTypeSystem.createFoundationInstance();
  reinforcementTypesSignal.value =
    ElementTypeSystem.createReinforcementInstance();
}
