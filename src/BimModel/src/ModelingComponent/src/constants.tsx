import React from "react";
import {
  IArchitectureModeling,
  IDrawType,
  IFile,
  IModeling,
  IModelingToolTabs,
  IModify,
  IPlumbingModeling,
  IStructureModeling,
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

const Modelings = {
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
//#region File
import {MdOutlineCreateNewFolder as NewProject} from "react-icons/md";
import {GoFileDirectory as Open} from "react-icons/go";
import {CiSaveDown2 as Save} from "react-icons/ci";
import dotbim from "@assets/dotbim.png";
import gltf from "@assets/gltf-icon.png";
import ifc from "@assets/ifc-icon.png";
import revit from "@assets/revit-256.png";

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
] as ITool[];

const Structure = [
  {
    type: "Structure Beam",
    icon: <StructureBeam />,
  },
  {
    type: "Structure Column",
    icon: <StructureColumn />,
  },
  {
    type: "Structure Wall",
    icon: <StructureWall />,
  },
  {
    type: "Structure Slab",
    icon: <StructureSlab />,
  },
  {
    type: "Structure Foundation",
    icon: <StructureFoundation />,
  },
  {
    type: "ReinForcement",
    icon: <ReinForcement />,
  },
] as ITool[];
const Plumbing = [
  {
    type: "Duct",
    icon: <Duct />,
  },
  {
    type: "Pipe",
    icon: <Pipe />,
  },
] as ITool[];
const Modify = [
  {
    type: "Copy",
    icon: <Copy />,
  },
  {
    type: "Move",
    icon: <Move />,
  },
  {
    type: "Trim",
    icon: <Trim />,
  },
  {
    type: "Extend",
    icon: <Extend />,
  },
] as ITool[];
const Files = [
  {
    type: "New Project",
    icon: <NewProject />,
  },
  {
    type: "Open",
    icon: <Open />,
  },
  {
    type: "Save",
    icon: <Save />,
  },
  {
    type: "Export Ifc",
    icon: <img src={ifc} className={iConClassName} />,
  },
  {
    type: "Export .bim",
    icon: <img src={dotbim} className={iConClassName} />,
  },
  {
    type: "Export .glb",
    icon: <img src={gltf} className={iConClassName} />,
  },
] as ITool[];

export function getModelings(
  type:
    | IArchitectureModeling
    | IStructureModeling
    | IPlumbingModeling
    | IFile
    | IModify
    | null
): IModeling[] {
  if (!type) return [];
  const {Finish, Cancel, Line, Rectangular, Arc, PolyLines, Point} = Modelings;
  switch (type) {
    case "Wall":
      return [Line, Rectangular, Arc, PolyLines];
    case "Floor":
      return [Finish, Line, Rectangular, Arc, PolyLines, Cancel];
    case "Ceiling":
      return [Finish, Line, Rectangular, Arc, PolyLines, Cancel];
    case "Roof":
      return [Finish, Line, Rectangular, Arc, PolyLines, Cancel];
    case "Column":
      return [Point, Cancel];
    case "Door":
      return [Point, Cancel];
    case "Window":
      return [Point, Cancel];
    case "Structure Beam":
      return [Line, Arc];
    case "Structure Column":
      return [Point, Cancel];
    case "Structure Wall":
      return [Line, Rectangular, Arc, PolyLines];
    case "Structure Slab":
      return [Finish, Line, Rectangular, Arc, PolyLines, Cancel];
    case "Structure Foundation":
      return [Finish, Line, Rectangular, Arc, PolyLines, Cancel];
    case "ReinForcement":
      return [];
    case "Duct":
      return [Line, Cancel];
    case "Pipe":
      return [Line, Cancel];
    default:
      return [];
  }
}
export const ModelingTools: IModelingToolTabs[] = [
  {discipline: "Files", types: Files},
  {discipline: "Architecture", types: Architecture},
  {discipline: "Structure", types: Structure},
  {discipline: "Plumbing", types: Plumbing},
  {discipline: "Modify", types: Modify},
];
