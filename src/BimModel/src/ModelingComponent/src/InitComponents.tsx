import React, {lazy} from "react";
import ReactDOM from "react-dom/client";
import {ModelingComponent} from "..";
const ModelingTabs = lazy(() => import("./Modeling/ModelingTabs"));
const NewProject = lazy(() => import("./Project/NewProject"));
const ProjectInfo = lazy(() => import("./Project/ProjectInfo"));
const ModelingOption = lazy(() => import("./ModelingOption/ModelingOption"));
const Units = lazy(() => import("./Units/Units"));
const LineOption = lazy(() => import("./LineOption/LineOption"));
const WorkPlaneOption = lazy(() => import("./WorkPlaneOption/WorkPlaneOption"));
const VisibilityOption = lazy(
  () => import("./VisibilityOption/VisibilityOption")
);
const VisibilityPanel = lazy(
  () => import("./VisibilityOption/VisibilityPanel")
);
const ElementType = lazy(
  () => import("./ModelingOption/ElementType/ElementType")
);

export function createModelingContainer(modeling: ModelingComponent) {
  const div = document.createElement("div");
  div.className = "h-full w-full relative";
  ReactDOM.createRoot(div).render(
    <>
      <ModelingTabs />
      <ProjectInfo modeling={modeling}></ProjectInfo>
      <NewProject modeling={modeling}></NewProject>
      <VisibilityPanel />
      <ElementType />
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

      <div className="relative h-full flex justify-end">
        <VisibilityOption />
        <WorkPlaneOption />
        <LineOption />
        <Units />
      </div>
    </>
  );
  return div;
}
