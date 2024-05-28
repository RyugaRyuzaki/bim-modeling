import {IModeling} from "@ModelingComponent/types";
import {Modelings} from "./constants";

export function getModelings(type: string): IModeling[] {
  if (!type) return [];
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
  switch (type) {
    case "Wall":
      return [Line, Rectangular, Arc, PolyLines];
    case "Floor":
      return [Finish, Line, Rectangular, Arc, PolyLines, PickLine, Cancel];
    case "Ceiling":
      return [Finish, Line, Rectangular, Arc, PolyLines, PickLine, Cancel];
    case "Roof":
      return [Finish, Line, Rectangular, Arc, PolyLines, PickLine, Cancel];
    case "Column":
      return [Point, Cancel];
    case "Door":
      return [Point, Cancel];
    case "Window":
      return [Point, Cancel];
    case "Structure Beam":
      return [Line, Arc, Circle];
    case "Structure Column":
      return [Point, Cancel];
    case "Structure Wall":
      return [Line, Rectangular, Arc, Circle, PolyLines];
    case "Structure Slab":
      return [
        Finish,
        Line,
        Rectangular,
        Arc,
        Circle,
        PolyLines,
        PickLine,
        Cancel,
      ];
    case "Structure Foundation":
      return [
        Finish,
        Line,
        Rectangular,
        Arc,
        Circle,
        PolyLines,
        PickLine,
        Cancel,
      ];
    case "ReinForcement":
      return [];
    case "Duct":
      return [Line, Cancel];
    case "Pipe":
      return [Line, Cancel];
    default:
      return [];
  }
}
