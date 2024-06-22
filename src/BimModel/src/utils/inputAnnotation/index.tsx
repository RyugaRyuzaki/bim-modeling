import React from "react";
import ReactDOM from "react-dom/client";
import {InputAnnotation, InputNumberAnnotation} from "./InputAnnotation";
import {Signal} from "@preact/signals-react";

export * from "./Annotation";

export function createInputAnnotationContainer(
  signal: Signal<string | number | null>,
  onInputBlur: (value: string) => void,
  widthInput = 50
) {
  const div = document.createElement("div");
  div.style.position = "absolute";

  ReactDOM.createRoot(div).render(
    <InputAnnotation
      signal={signal}
      onInputBlur={onInputBlur}
      widthInput={widthInput}
    />
  );
  return div;
}
export function createInputNumberAnnotationContainer(
  signal: Signal<string | number | null>,
  onInputBlur: (value: string) => void,
  widthInput = 50
) {
  const div = document.createElement("div");
  div.style.position = "absolute";

  ReactDOM.createRoot(div).render(
    <InputNumberAnnotation
      signal={signal}
      onInputBlur={onInputBlur}
      widthInput={widthInput}
    />
  );
  return div;
}
export function createAnnotationContainer(radius: number) {
  const div = document.createElement("div");
  div.style.position = "absolute";
  div.style.width = `${radius}px`;
  div.style.height = `${radius}px`;
  div.style.top = `${0}px`;
  div.style.left = `${0}px`;
  return div;
}
