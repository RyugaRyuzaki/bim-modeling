import React from "react";

import {AiOutlineCheckCircle as Finish} from "react-icons/ai";
import {PiLineSegmentDuotone as Line} from "react-icons/pi";
import {BsBoundingBoxCircles as Rectangular} from "react-icons/bs";
import {AiOutlineVerticalAlignBottom as PickLine} from "react-icons/ai";
import {BiCircle as Circle} from "react-icons/bi";
import {SiArchicad as Arc} from "react-icons/si";
import {MdOutlineShare as PolyLines} from "react-icons/md";
import {TiDeleteOutline as Cancel} from "react-icons/ti";
import {FaRegCircleDot as Point} from "react-icons/fa6";
import {drawingTypeSignal, modelingSignal} from "@BimModel/src/Signals";
import {iConClassName} from "./iConClass";
import {IDrawType, IModeling} from "../../types";
const onClick = (drawType: IDrawType) => {
  if (drawType === "Finish" || drawType === "Cancel") {
    drawingTypeSignal.value = "None";
    modelingSignal.value = null;
    return;
  }
  drawingTypeSignal.value = drawType;
};
//@ts-ignore
export const Modelings: Record<IDrawType, IModeling> = {
  Finish: {
    icon: <Finish className={iConClassName} />,
    drawType: "Finish",
    onClick,
  } as IModeling,
  Line: {
    icon: <Line className={iConClassName} />,
    drawType: "Line",
    onClick,
  } as IModeling,
  Rectangular: {
    icon: <Rectangular className={iConClassName} />,
    drawType: "Rectangular",
    onClick,
  } as IModeling,
  Arc: {
    icon: <Arc className={iConClassName} />,
    drawType: "Arc",
    onClick,
  } as IModeling,
  Circle: {
    icon: <Circle className={iConClassName} />,
    drawType: "Circle",
    onClick,
  } as IModeling,
  PolyLines: {
    icon: <PolyLines className={iConClassName} />,
    drawType: "PolyLines",
    onClick,
  } as IModeling,
  Point: {
    icon: <Point className={iConClassName} />,
    drawType: "Point",
    onClick,
  } as IModeling,
  PickLine: {
    icon: <PickLine className={iConClassName} />,
    drawType: "PickLine",
    onClick,
  } as IModeling,
  Cancel: {
    icon: <Cancel className={iConClassName} />,
    drawType: "Cancel",
    onClick,
  } as IModeling,
};
