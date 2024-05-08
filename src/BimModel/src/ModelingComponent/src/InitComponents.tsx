import React from "react";
import ReactDOM from "react-dom/client";
import {ModelingComponent} from "..";
import ModelingTabs from "./Components/ModelingTabs";

export function createModelingContainer(modeling: ModelingComponent) {
  const div = document.createElement("div");
  div.className = "h-full w-full relative";
  ReactDOM.createRoot(div).render(<ModelingTabs></ModelingTabs>);
  return div;
}
