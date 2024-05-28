import React from "react";
import {IModelingToolTabs, ITool} from "@ModelingComponent/types";
//#region Draw

//#endregion
//#region IVisibilityButton

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
import {ReactComponent as StructureFoundation} from "@assets/icon/Foundation.svg";
import {ReactComponent as ReinForcement} from "@assets/icon/Rebar.svg";
//#endregion
//#region Plumbing
import {PiPerspective as Duct} from "react-icons/pi";
import {GiTeePipe as Pipe} from "react-icons/gi";
import {FaCrosshairs as AirTerminal} from "react-icons/fa";
//#endregion
//#region Modify
import {BiCopy as Copy} from "react-icons/bi";
import {IoMdMove as Move} from "react-icons/io";
import {ReactComponent as Trim} from "@assets/icon/Trim.svg";
import {ReactComponent as Extend} from "@assets/icon/Extend.svg";
import {MdAlignHorizontalLeft as Align} from "react-icons/md";
import {iConClassName} from "./iConClass";
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
  {
    type: "AirTerminal",
    icon: <AirTerminal className={iConClassName} />,
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
  {
    type: "Align",
    icon: <Align className={iConClassName} />,
  },
] as ITool[];

export const ModelingTools: IModelingToolTabs[] = [
  // {discipline: "Architecture", types: Architecture},
  {discipline: "Structure", types: Structure},
  {discipline: "Plumbing", types: Plumbing},
  {discipline: "Modify", types: Modify},
];
