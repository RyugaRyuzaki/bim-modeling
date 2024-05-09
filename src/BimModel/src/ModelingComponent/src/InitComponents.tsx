import React from "react";
import ReactDOM from "react-dom/client";
import {ModelingComponent} from "..";
import ModelingTabs from "./Modeling/ModelingTabs";
import ProjectInfo from "./Project/ProjectInfo";
import ModelingOption from "./ModelingOption/ModelingOption";
import Units from "./Units/Units";
import NewProject from "./Project/NewProject";

export function createModelingContainer(modeling: ModelingComponent) {
  const div = document.createElement("div");
  div.className = "h-full w-full relative";
  ReactDOM.createRoot(div).render(
    <>
      <ModelingTabs></ModelingTabs>
      <ProjectInfo modeling={modeling}></ProjectInfo>
      <NewProject modeling={modeling}></NewProject>
    </>
  );
  return div;
}
export function createOptionContainer(_modeling: ModelingComponent) {
  const div = document.createElement("div");
  div.className = "h-full w-full relative flex justify-between";
  ReactDOM.createRoot(div).render(
    <>
      <ModelingOption />
      <Units />
    </>
  );
  return div;
}
