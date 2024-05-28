import React from "react";
import ReactDOM from "react-dom/client";
import {StructureComponent} from "..";
import ModelStructure from "./ModelStructure/ModelStructure";

export function createStructureContainer(structure: StructureComponent) {
  const div = document.createElement("div");
  div.className = "h-full w-full relative";
  ReactDOM.createRoot(div).render(<ModelStructure structure={structure} />);
  return div;
}
