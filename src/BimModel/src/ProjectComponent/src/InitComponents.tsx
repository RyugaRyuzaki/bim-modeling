import React from "react";
import ReactDOM from "react-dom/client";
import {ProjectComponent} from "..";
import ModelStructure from "./ModelStructure/ModelStructure";

export function createStructureContainer(project: ProjectComponent) {
  const div = document.createElement("div");
  div.className = "h-full w-full relative";
  ReactDOM.createRoot(div).render(<ModelStructure project={project} />);
  return div;
}
