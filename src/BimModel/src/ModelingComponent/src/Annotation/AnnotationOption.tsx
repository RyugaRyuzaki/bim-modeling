import React, {memo} from "react";
import {MdGrid3X3} from "react-icons/md";
import {iConClassName} from "../constants";
import {Button} from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {showAnnotationPanelSignal} from "@BimModel/src/Signals";
const AnnotationOption = () => {
  return (
    <div className="relative h-full flex justify-center items-center mx-1">
      <TooltipProvider delayDuration={10}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className={`h-[80%] p-1 my-auto hover:bg-green-400 disabled:cursor-none`}
              onClick={() =>
                (showAnnotationPanelSignal.value =
                  !showAnnotationPanelSignal.value)
              }
            >
              <MdGrid3X3 className={iConClassName} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Grid</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default memo(AnnotationOption);
