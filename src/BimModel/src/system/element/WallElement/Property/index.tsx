import React from "react";
import ReactDOM from "react-dom/client";
import {WallElement} from "..";
import Property from "./Property";

export function createWallContainer(wall: WallElement) {
  const div = document.createElement("div");
  div.className = "h-full w-full relative p-1";
  ReactDOM.createRoot(div).render(<Property wall={wall} />);
  return div;
}
