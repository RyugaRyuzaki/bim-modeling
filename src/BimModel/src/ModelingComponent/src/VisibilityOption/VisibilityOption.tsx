import React, {memo} from "react";
import {FaEye} from "react-icons/fa";
import {Button} from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {iConClassName} from "../constants";
import {openVisibilitySignal} from "@BimModel/src/Signals";

const VisibilityOption = () => {
  return (
    <div className="relative h-full flex justify-center items-center mx-2">
      <div className="h-[80%] w-[1px] dark:bg-white bg-black  my-auto"></div>
      <TooltipProvider delayDuration={10}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className={`h-[90%] p-1 my-auto mx-1 hover:bg-green-400 disabled:cursor-none`}
              onClick={() => (openVisibilitySignal.value = true)}
            >
              <FaEye className={iConClassName} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Visibility</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default memo(VisibilityOption);
