import React from "react";

import {BsBoxSeam as Icon3D} from "react-icons/bs";
import {FiGrid as IconPlane} from "react-icons/fi";
import {FaBuilding as IconElevation} from "react-icons/fa";
// import {LuGrid as IconPlane} from "react-icons/lu";
import {IVisibilityButton} from "../../types";
import {iConClassName} from "./iConClass";

export const VisibilityStates: IVisibilityButton[] = [
  {
    tooltip: "3D",
    icon: <Icon3D className={iConClassName} />,
  },
  {
    tooltip: "Plane",
    icon: <IconPlane className={iConClassName} />,
  },
  {
    tooltip: "Elevation",
    icon: <IconElevation className={iConClassName} />,
  },
];
