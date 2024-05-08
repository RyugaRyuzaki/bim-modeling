import React from "react";
import {
  IArchitecture,
  IStructure,
  IPlumbing,
  IModeling,
  IModelingTool,
} from "@BimModel/src/types";
//#region Draw
import {AiOutlineCheckCircle as Finish} from "react-icons/ai";
import {PiLineSegmentDuotone as Line} from "react-icons/pi";
import {BsBoundingBoxCircles as Rectangular} from "react-icons/bs";
import {BsDashCircleDotted as Arc} from "react-icons/bs";
import {MdOutlineShare as PolyLines} from "react-icons/md";
import {TiDeleteOutline as Cancel} from "react-icons/ti";
export const Modelings: IModeling[] = [
  {
    icon: <Finish />,
    drawType: "Finish",
  },
  {
    icon: <Line />,
    drawType: "Line",
  },
  {
    icon: <Rectangular />,
    drawType: "Rectangular",
  },
  {
    icon: <Arc />,
    drawType: "Arc",
  },
  {
    icon: <PolyLines />,
    drawType: "PolyLines",
  },
  {
    icon: <Cancel />,
    drawType: "Cancel",
  },
];
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

//#endregion
const Architecture = [
  {
    type: "Wall",
    icon: <Wall />,
  },
  {
    type: "Floor",
    icon: <Floor />,
  },
  {
    type: "Column",
    icon: <Column />,
  },
  {
    type: "Roof",
    icon: <Roof />,
  },
  {
    type: "Door",
    icon: <Door />,
  },
  {
    type: "Window",
    icon: <Window />,
  },
] as IArchitecture[];
const Structure = [
  {
    type: "StructureBeam",
    icon: <StructureBeam />,
  },
  {
    type: "StructureColumn",
    icon: <StructureColumn />,
  },
  {
    type: "StructureWall",
    icon: <StructureWall />,
  },
  {
    type: "StructureSlab",
    icon: <StructureSlab />,
  },
  {
    type: "StructureFoundation",
    icon: <StructureFoundation />,
  },
  {
    type: "ReinForcement",
    icon: <ReinForcement />,
  },
] as IStructure[];
const Plumbing = [
  {
    type: "Duct",
    icon: <Duct />,
  },
  {
    type: "Pipe",
    icon: <Pipe />,
  },
] as IPlumbing[];
export const ModelingTools: IModelingTool[] = [
  {discipline: "Architecture", types: Architecture},
  {discipline: "Structure", types: Structure},
  {discipline: "Plumbing", types: Plumbing},
];
