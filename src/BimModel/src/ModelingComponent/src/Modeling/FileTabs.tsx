import React from "react";
import {buttonClassName, iConClassName} from "../constants";
//#region File
import {MdOutlineCreateNewFolder as NewProject} from "react-icons/md";
import {GoFileDirectory as Open} from "react-icons/go";
import {GoInfo as Project} from "react-icons/go";
import {CiSaveDown2 as Save} from "react-icons/ci";
import dotbim from "@assets/dotbim.png";
import gltf from "@assets/gltf-icon.png";
import ifc from "@assets/ifc-icon.png";
import {ITool} from "@ModelingComponent/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {
  exportIfcSignal,
  newProjectInfoSignal,
  openProjectInfoSignal,
  projectSignal,
} from "@BimModel/src/Signals";
//#endregion

const FileButton = ({
  tool,
  onClick,
}: {
  tool: ITool;
  onClick: (e: any) => void;
}) => {
  return (
    <TooltipProvider delayDuration={10}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className={`${buttonClassName}`}
            onClick={onClick}
          >
            {tool.icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{tool.type}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const FileTabs = () => {
  const New = {
    type: "New Project",
    icon: <NewProject className={iConClassName} />,
  };
  const OpenProject = {
    type: "Open",
    icon: <Open className={iConClassName} />,
  };
  const ProjectInfo = {
    type: "Project Info",
    icon: <Project className={iConClassName} />,
  };
  const SaveProject = {
    type: "Save",
    icon: <Save className={iConClassName} />,
  };
  const ExportIfc = {
    type: "Export Ifc",
    icon: <img src={ifc} className={iConClassName} />,
  };
  const ExportDotBim = {
    type: "Export .bim",
    icon: <img src={dotbim} className={iConClassName} />,
  };
  const ExportGlb = {
    type: "Export .glb",
    icon: <img src={gltf} className={iConClassName} />,
  };

  const handleNewProject = (_e: any) => {
    newProjectInfoSignal.value = true;
  };
  const handleOpenProject = (_e: any) => {};
  const handleOpenProjectInfo = (_e: any) => {
    openProjectInfoSignal.value = true;
  };
  const handleSaveProject = (_e: any) => {};
  const handleExportIfc = (_e: any) => {
    exportIfcSignal.value = true;
  };
  const handleExportDotBim = (_e: any) => {};
  const handleExportGlb = (_e: any) => {};
  return (
    <div className="relative h-full w-full flex justify-start items-center">
      <FileButton tool={New} onClick={handleNewProject} />
      <FileButton tool={OpenProject} onClick={handleOpenProject} />
      <FileButton tool={ExportIfc} onClick={handleExportIfc} />
      {projectSignal.value && (
        <>
          <FileButton tool={ProjectInfo} onClick={handleOpenProjectInfo} />
          <FileButton tool={SaveProject} onClick={handleSaveProject} />
          <FileButton tool={ExportDotBim} onClick={handleExportDotBim} />
          <FileButton tool={ExportGlb} onClick={handleExportGlb} />
        </>
      )}
    </div>
  );
};

export default FileTabs;
