import React from "react";
import ReactDOM from "react-dom/client";
import {LocationLine} from "../LocationLine";
import DimensionLocationLine from "./DimensionLocationLine";
import {LocationArc} from "../LocationArc";
import DimensionLocationRadius from "./DimensionLocationRadius";
import DimensionLocationAngle from "./DimensionLocationAngle";

export function createDimensionLocationLineContainer(location: LocationLine) {
  const div = document.createElement("div");
  div.style.zIndex = "4000";
  ReactDOM.createRoot(div).render(
    <DimensionLocationLine location={location} />
  );
  return div;
}
export function createDimensionRadiusContainer(location: LocationArc) {
  const div = document.createElement("div");
  div.style.zIndex = "4000";
  ReactDOM.createRoot(div).render(
    <DimensionLocationRadius location={location} />
  );
  return div;
}
export function createDimensionAngleContainer(location: LocationArc) {
  const div = document.createElement("div");
  div.style.zIndex = "4000";
  ReactDOM.createRoot(div).render(
    <DimensionLocationAngle location={location} />
  );
  return div;
}
