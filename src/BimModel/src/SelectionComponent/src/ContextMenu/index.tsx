import React from "react";
import ReactDOM from "react-dom/client";
import ContextMenuPanel from "./ContextMenuPanel";
import {SelectionComponent} from "../..";

export function createContextMenu(
  selectionComponent: SelectionComponent
): HTMLDivElement {
  const div = document.createElement("div");
  div.className = "absolute z-4000";
  ReactDOM.createRoot(div!).render(
    <ContextMenuPanel
      selectionComponent={selectionComponent}
    ></ContextMenuPanel>
  );
  return div;
}
