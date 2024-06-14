import {ILevel} from "./types";
import {v4 as uuidv4} from "uuid";
export const defaultLevels: ILevel[] = [
  {
    name: "Level 1",
    index: 0,
    elevation: 0.0,
    uuid: uuidv4(),
  },
  {
    name: "Level 2",
    index: 1,
    elevation: 4.0,
    uuid: uuidv4(),
  },
];
