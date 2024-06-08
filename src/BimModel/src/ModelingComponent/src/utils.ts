import {IModeling} from "@ModelingComponent/types";
import {Modelings} from "./constants";

import {ICategory} from "@system/element/types";
const {
  Finish,
  Cancel,
  Line,
  Rectangular,
  Arc,
  Circle,
  PolyLines,
  Point,
  PickLine,
} = Modelings;
export const CategoryTool: Record<ICategory, IModeling[]> = {
  Wall: [Line, Rectangular, Arc],
  CurtainWall: [Line, Rectangular, Arc],
  Floor: [Finish, Line, Rectangular, Arc, PolyLines, PickLine, Cancel],
  Ceiling: [Finish, Line, Rectangular, Arc, PolyLines, PickLine, Cancel],
  Roof: [Finish, Line, Rectangular, Arc, PolyLines, PickLine, Cancel],
  Column: [Point],
  Door: [Point],
  Window: [Point],
  "Structure Beam": [Line, Arc, Circle, PickLine],
  "Structure Column": [Point],
  "Structure Wall": [Line, Rectangular, Arc, Circle, PolyLines, PickLine],
  "Structure Slab": [
    Finish,
    Line,
    Rectangular,
    Arc,
    PolyLines,
    PickLine,
    Cancel,
  ],
  "Structure Foundation": [
    Finish,
    Line,
    Rectangular,
    Arc,
    PolyLines,
    PickLine,
    Cancel,
  ],
  ReinForcement: [],
  Duct: [Line, Cancel],
  Pipe: [Line, Cancel],
  AirTerminal: [Line, Cancel],
};

export function getModelings(type: string): IModeling[] {
  return type ? CategoryTool[type] ?? [] : [];
}
