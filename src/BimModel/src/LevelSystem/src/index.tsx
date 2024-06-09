import React, {lazy} from "react";
import ReactDOM from "react-dom/client";
import {LevelSystem} from "..";
const ModelStructure = lazy(() => import("./ModelStructure"));

export * from "./Elevation";

export function createStructureContainer(level: LevelSystem) {
  const div = document.createElement("div");
  div.className = "h-full w-full relative";
  ReactDOM.createRoot(div).render(<ModelStructure level={level} />);
  return div;
}
