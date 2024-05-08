import {IDiscipline} from "@BimModel/src/types";
import {signal} from "@preact/signals-react";

// export const modelings = getAllModelingType();
export const disciplineSignal = signal<IDiscipline>("Architecture");
