import * as THREE from "three";
import {border, borderColor, ns, predecessorBorder, strokeStyle} from "./enum";

export function createSVGSelection(): SVGElement {
  const svg = document.createElementNS(ns, "svg");
  svg.setAttributeNS(null, "width", `100%`);
  svg.setAttributeNS(null, "height", `100%`);
  svg.classList.add("selectionWindow");
  return svg;
}
export function createRectSVGSelection(
  svg: SVGElement,
  left: number,
  top: number,
  width: number,
  height: number
): SVGElement {
  const rect = document.createElementNS(ns, "rect");
  rect.setAttributeNS(null, "width", `${width}`);
  rect.setAttributeNS(null, "height", `${height}`);
  rect.setAttributeNS(null, "fill", strokeStyle.fillTransparentColor);
  rect.setAttributeNS(null, "fill-opacity", `0.3`); // Không fill color
  rect.setAttributeNS(null, "stroke", borderColor); // Border màu đen
  rect.setAttributeNS(null, "stroke-width", `${strokeStyle.lineWidth}`); // Độ rộng của bor
  rect.setAttributeNS(null, "x", `${left}`); // Vị trí left
  rect.setAttributeNS(null, "y", `${top}`); // Vị trí top
  svg.appendChild(rect);
  return rect;
}
export function createSVG(
  container: HTMLDivElement,
  width?: number,
  height?: number
): SVGElement {
  const svg = document.createElementNS(ns, "svg");
  svg.setAttributeNS(null, "width", `${width || "100%"}`);
  svg.setAttributeNS(null, "height", `${height || "100%"}`);
  container.appendChild(svg);
  return svg;
}

export function createRectSVG(
  svg: SVGElement,
  left: number,
  top: number,
  width: number,
  height: number
): SVGElement {
  const rect = document.createElementNS(ns, "rect");
  rect.setAttributeNS(null, "width", `${width}`);
  rect.setAttributeNS(null, "height", `${height}`);
  rect.setAttributeNS(null, "fill", "none"); // Không fill color
  rect.setAttributeNS(null, "stroke", borderColor); // Border màu đen
  rect.setAttributeNS(null, "stroke-width", `${border}`); // Độ rộng của bor
  rect.setAttributeNS(null, "x", `${left}`); // Vị trí left
  rect.setAttributeNS(null, "y", `${top}`); // Vị trí top
  svg.appendChild(rect);
  return rect;
}

export function createLineSVG(
  svg: SVGElement,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): SVGElement {
  const line = document.createElementNS(ns, "line");
  line.setAttributeNS(null, "x1", `${x1}`);
  line.setAttributeNS(null, "y1", `${y1}`);
  line.setAttributeNS(null, "x2", `${x2}`);
  line.setAttributeNS(null, "y2", `${y2}`);
  line.setAttributeNS(null, "stroke", borderColor); // Stroke color
  line.setAttributeNS(null, "stroke-width", `${border}`); // Stroke width
  svg.appendChild(line);
  return line;
}

export function compactText(text: string, width0: number) {
  const w0 = (strokeStyle.fontSize * 2) / 3;
  if (text.length * w0 < width0) return text;
  let newText = "";
  for (let i = 0; i < text.length; i++) {
    newText = newText + text[i];
    if (i * w0 >= width0 - 5 * w0) break;
  }
  return newText + "...";
}
export function createTextSVG(
  svg: SVGElement,
  left: number,
  top: number,
  text: string,
  isCenter = false
): SVGElement {
  const textElement = document.createElementNS(ns, "text");
  textElement.textContent = text;
  textElement.setAttributeNS(null, "x", `${left}`);
  textElement.setAttributeNS(null, "y", `${top}`);
  textElement.setAttributeNS(null, "font-size", `${strokeStyle.fontSize}`);
  textElement.setAttributeNS(null, "fill", `${strokeStyle.textColor}`);
  textElement.setAttributeNS(null, "font-family", `${strokeStyle.fontFamily}`); // Font family
  textElement.setAttributeNS(null, "font-style", `${strokeStyle.fontStyle}`); // Font style (normal, italic, etc.)
  textElement.setAttributeNS(null, "font-weight", `${strokeStyle.fontweight}`); // Font weight (normal, bold, etc.)
  textElement.classList.add("select-none");
  svg.appendChild(textElement);
  if (isCenter) {
    const textLength = textElement.getComputedTextLength();
    textElement.setAttributeNS(null, "x", `${left - textLength / 2}`);
    textElement.setAttributeNS(null, "y", `${top + strokeStyle.fontSize / 2}`);
  }
  textElement.classList.add("pointer-events-none");
  return textElement;
}
export function createTextTimeLineSVG(
  svg: SVGElement,
  left: number,
  top: number,
  text: string
) {
  const textElement = document.createElementNS(ns, "text");
  textElement.textContent = text;
  textElement.setAttributeNS(null, "x", `${left}`);
  textElement.setAttributeNS(null, "y", `${top}`);
  textElement.setAttributeNS(null, "font-size", `${strokeStyle.fontSize}`);
  textElement.setAttributeNS(null, "fill", `${strokeStyle.textColor}`);
  textElement.setAttributeNS(null, "font-family", `${strokeStyle.fontFamily}`); // Font family
  textElement.setAttributeNS(null, "font-style", `${strokeStyle.fontStyle}`); // Font style (normal, italic, etc.)
  textElement.setAttributeNS(null, "font-weight", `${strokeStyle.fontweight}`); // Font weight (normal, bold, etc.)
  textElement.classList.add("select-none");
  svg.appendChild(textElement);
  const textLength = textElement.getComputedTextLength();
  textElement.setAttributeNS(null, "x", `${left - textLength / 2}`);
  textElement.setAttributeNS(null, "y", `${top + strokeStyle.fontSize / 2}`);
  textElement.classList.add("pointer-events-none");

  return {textElement, textLength};
}
export function createTextLeftSVG(
  svg: SVGElement,
  left: number,
  top: number,
  text: string
): SVGElement {
  const textElement = document.createElementNS(ns, "text");
  textElement.textContent = text;
  textElement.setAttributeNS(null, "x", `${left}`);
  textElement.setAttributeNS(null, "y", `${top}`);
  textElement.setAttributeNS(null, "font-size", `${strokeStyle.fontSize}`);
  textElement.setAttributeNS(null, "fill", `${strokeStyle.textColor}`);
  textElement.setAttributeNS(null, "font-family", `${strokeStyle.fontFamily}`); // Font family
  textElement.setAttributeNS(null, "font-style", `${strokeStyle.fontStyle}`); // Font style (normal, italic, etc.)
  textElement.setAttributeNS(null, "font-weight", `${strokeStyle.fontweight}`); // Font weight (normal, bold, etc.)
  textElement.classList.add("select-none");
  svg.appendChild(textElement);
  textElement.classList.add("pointer-events-none");
  return textElement;
}
export function setUpPath(
  svg: SVGElement,
  points: THREE.Vector2[]
): SVGElement {
  const polygon = document.createElementNS(ns, "polygon");
  const pointsString = points.map((point) => `${point.x},${point.y}`).join(" ");
  polygon.setAttributeNS(null, "points", pointsString);
  polygon.setAttributeNS(null, "fill", "none"); // Không fill color
  polygon.setAttributeNS(null, "stroke", borderColor); // Border màu đen
  polygon.setAttributeNS(null, "stroke-width", `${border}`); // Độ rộng của bor
  svg.appendChild(polygon);
  return polygon;
}
export function setUpPolyLine(
  svg: SVGElement,
  points: THREE.Vector2[]
): SVGElement {
  const polygon = document.createElementNS(ns, "polyline");
  const pointsString = points.map((point) => `${point.x},${point.y}`).join(" ");
  polygon.setAttributeNS(null, "points", pointsString);
  polygon.setAttributeNS(null, "fill", "none"); // Không fill color
  polygon.setAttributeNS(null, "stroke", borderColor); // Border màu đen
  polygon.setAttributeNS(null, "stroke-width", `2`); // Độ rộng của bor
  svg.appendChild(polygon);
  return polygon;
}
export function createEllipse(
  svg: SVGElement,
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number
): SVGElement {
  const ellipse = document.createElementNS(ns, "ellipse");
  ellipse.setAttribute("cx", `${centerX}`);
  ellipse.setAttribute("cy", `${centerY}`);
  ellipse.setAttribute("rx", `${radiusX}`);
  ellipse.setAttribute("ry", `${radiusY}`);
  svg.appendChild(ellipse);
  return ellipse;
}

function createDiagonalPattern(isBlack = false): SVGDefsElement {
  const pattern = document.createElementNS(ns, "pattern");
  pattern.setAttributeNS(
    null,
    "id",
    `${isBlack ? "diagonalPatternBlack" : "diagonalPattern"}`
  );
  pattern.setAttributeNS(null, "patternUnits", "userSpaceOnUse");
  pattern.setAttributeNS(null, "width", "10");
  pattern.setAttributeNS(null, "height", "10");
  const line = document.createElementNS(ns, "line");
  line.setAttributeNS(null, "x1", "0");
  line.setAttributeNS(null, "y1", "0");
  line.setAttributeNS(null, "x2", "10");
  line.setAttributeNS(null, "y2", "10");
  line.setAttributeNS(null, "stroke", `${isBlack ? "black" : "white"}`);
  line.setAttributeNS(null, "stroke-width", "1");
  pattern.appendChild(line);
  const defs = document.createElementNS(ns, "defs");
  defs.appendChild(pattern);
  return defs;
}

export const diagonalPattern: SVGDefsElement = createDiagonalPattern();
export const diagonalPatternBlack: SVGDefsElement = createDiagonalPattern(true);
export const urlDiagonalPattern = "url(#diagonalPattern)";
export const urlDiagonalPatternBlack = "url(#diagonalPatternBlack)";
