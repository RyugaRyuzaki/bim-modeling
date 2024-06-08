import React, {memo, useState} from "react";
import {MdGridOff, MdGridOn} from "react-icons/md";
import {Button} from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {showWorkPlaneSignal} from "@BimModel/src/Signals";
import {iConClassName} from "../constants";
import {useSignalEffect} from "@preact/signals-react";

const WorkPlaneOption = () => {
  const [tooltip, setTooltip] = useState<string>("Show WorkPlane");
  const onChangeVisibility = () => {
    showWorkPlaneSignal.value = !showWorkPlaneSignal.value;
  };
  useSignalEffect(() => {
    setTooltip(showWorkPlaneSignal.value ? "Hide" : "Show" + " WorkPlane");
  });
  return (
    <div className="relative h-full flex justify-center items-center mx-2">
      <div className="h-[80%] w-[1px] dark:bg-white bg-black  my-auto"></div>
      <TooltipProvider delayDuration={10}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className={`h-[90%] p-1 my-auto mx-1 hover:bg-green-400 disabled:cursor-none`}
              onClick={onChangeVisibility}
            >
              {showWorkPlaneSignal.value ? (
                <MdGridOff className={iConClassName} />
              ) : (
                <MdGridOn className={iConClassName} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default memo(WorkPlaneOption);
