import React, {memo, useState} from "react";
import {MdGridOff, MdGridOn} from "react-icons/md";
import {Button} from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {selectViewSignal, showWorkPlaneSignal} from "@BimModel/src/Signals";
import {iConClassName} from "../constants";
import {useSignalEffect} from "@preact/signals-react";
import {useSignals} from "@preact/signals-react/runtime";

const WorkPlaneOption = () => {
  useSignals();

  const [tooltip, setTooltip] = useState<string>("Show WorkPlane");
  const onChangeVisibility = () => {
    showWorkPlaneSignal.value = !showWorkPlaneSignal.value;
  };
  useSignalEffect(() => {
    setTooltip(showWorkPlaneSignal.value ? "Hide" : "Show" + " WorkPlane");
  });
  return (
    <>
      {selectViewSignal.value && selectViewSignal.value.viewType === "Plan" && (
        <div className="relative h-full flex justify-center items-center mx-1">
          <TooltipProvider delayDuration={10}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className={`h-[80%] p-1 my-auto hover:bg-green-400 disabled:cursor-none`}
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
      )}
    </>
  );
};

export default memo(WorkPlaneOption);
