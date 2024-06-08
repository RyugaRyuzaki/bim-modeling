import React, {lazy} from "react";
import ReactDOM from "react-dom/client";
const Property = lazy(() => import("./Property"));

export function createElementContainer() {
  const div = document.createElement("div");
  div.className = "h-full w-full relative p-1";
  ReactDOM.createRoot(div).render(<Property />);
  return div;
}
