import React from "react";
import {
  IDrawType,
  IModeling,
  IModelingToolTabs,
  ITool,
} from "@BimModel/src/types";
//#region Draw
import {AiOutlineCheckCircle as Finish} from "react-icons/ai";
import {PiLineSegmentDuotone as Line} from "react-icons/pi";
import {BsBoundingBoxCircles as Rectangular} from "react-icons/bs";
import {BsDashCircleDotted as Arc} from "react-icons/bs";
import {MdOutlineShare as PolyLines} from "react-icons/md";
import {TiDeleteOutline as Cancel} from "react-icons/ti";
import {FaRegCircleDot as Point} from "react-icons/fa6";
export const iConClassName = "w-[30px] h-[30px]";
const onClick = (drawType: IDrawType) => {
  switch (drawType) {
    case "Finish":
    case "Cancel":
      drawingTypeSignal.value = "None";
      modelingSignal.value = null;
      break;
    case "Line":
      break;
    case "Rectangular":
      break;
    case "PolyLines":
      break;
    case "Arc":
      break;
    case "Point":
      break;
    default:
      break;
  }
};

export const Modelings = {
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
  Cancel: {
    icon: <Cancel className={iConClassName} />,
    drawType: "Cancel",
    onClick,
  } as IModeling,
};

//#endregion

//#region Architecture
import {GiStoneWall as Wall} from "react-icons/gi";
import {BiRectangle as Floor} from "react-icons/bi";
import {PiColumnsLight as Column} from "react-icons/pi";
import {MdRoofing as Roof} from "react-icons/md";
import {BsDoorOpen as Door} from "react-icons/bs";
import {AiOutlineWindows as Window} from "react-icons/ai";
//#endregion
//#region Structure
import {GiWoodBeam as StructureBeam} from "react-icons/gi";
import {PiColumnsLight as StructureColumn} from "react-icons/pi";
import {PiWallBold as StructureWall} from "react-icons/pi";
import {MdOutlineCropLandscape as StructureSlab} from "react-icons/md";
import {MdFoundation as StructureFoundation} from "react-icons/md";
import {MdFoundation as ReinForcement} from "react-icons/md";
//#endregion
//#region Plumbing
import {PiPerspective as Duct} from "react-icons/pi";
import {GiTeePipe as Pipe} from "react-icons/gi";
import {drawingTypeSignal, modelingSignal} from "@BimModel/src/Signals";
//#endregion
//#region Modify
import {BiCopy as Copy} from "react-icons/bi";
import {IoMdMove as Move} from "react-icons/io";
import {BiTrim as Trim} from "react-icons/bi";
import {CgExtension as Extend} from "react-icons/cg";
//#endregion

const Architecture = [
  {
    type: "Wall",
    icon: <Wall className={iConClassName} />,
  },
  {
    type: "Floor",
    icon: <Floor className={iConClassName} />,
  },
  {
    type: "Column",
    icon: <Column className={iConClassName} />,
  },
  {
    type: "Roof",
    icon: <Roof className={iConClassName} />,
  },
  {
    type: "Door",
    icon: <Door className={iConClassName} />,
  },
  {
    type: "Window",
    icon: <Window className={iConClassName} />,
  },
] as ITool[];

const Structure = [
  {
    type: "Structure Beam",
    icon: <StructureBeam className={iConClassName} />,
  },
  {
    type: "Structure Column",
    icon: <StructureColumn className={iConClassName} />,
  },
  {
    type: "Structure Wall",
    icon: <StructureWall className={iConClassName} />,
  },
  {
    type: "Structure Slab",
    icon: <StructureSlab className={iConClassName} />,
  },
  {
    type: "Structure Foundation",
    icon: <StructureFoundation className={iConClassName} />,
  },
  {
    type: "ReinForcement",
    icon: <ReinForcement className={iConClassName} />,
  },
] as ITool[];
const Plumbing = [
  {
    type: "Duct",
    icon: <Duct className={iConClassName} />,
  },
  {
    type: "Pipe",
    icon: <Pipe className={iConClassName} />,
  },
] as ITool[];
const Modify = [
  {
    type: "Copy",
    icon: <Copy className={iConClassName} />,
  },
  {
    type: "Move",
    icon: <Move className={iConClassName} />,
  },
  {
    type: "Trim",
    icon: <Trim className={iConClassName} />,
  },
  {
    type: "Extend",
    icon: <Extend className={iConClassName} />,
  },
] as ITool[];

export const ModelingTools: IModelingToolTabs[] = [
  {discipline: "Architecture", types: Architecture},
  {discipline: "Structure", types: Structure},
  {discipline: "Plumbing", types: Plumbing},
  {discipline: "Modify", types: Modify},
];
