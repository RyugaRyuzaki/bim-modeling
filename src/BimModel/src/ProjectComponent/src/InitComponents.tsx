import React, {lazy} from "react";
import ReactDOM from "react-dom/client";
import {ProjectComponent} from "..";
const ModelStructure = lazy(() => import("./ModelStructure/ModelStructure"));

export function createStructureContainer(_project: ProjectComponent) {
  const div = document.createElement("div");
  div.className = "h-full w-full relative";
  ReactDOM.createRoot(div).render(<></>);
  return div;
}
