import React, {FC, ReactNode} from "react";
import {Button} from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {IVisibilityButton} from "../../types";
import {useComputed} from "@preact/signals-react";
import {visibilityStateSignal} from "@BimModel/src/Signals";
const VisibilityButton: FC<IVisibilityButton> = ({icon, tooltip}) => {
  const active = useComputed<boolean>(() => {
    return visibilityStateSignal.value === tooltip;
  });
  const onChangeVisibility = () => {
    visibilityStateSignal.value = tooltip;
  };
  return (
    <TooltipProvider delayDuration={10}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className={`h-[90%] p-1 my-auto mx-1 hover:bg-green-400 disabled:cursor-none  ${
              active.value ? "bg-blue-400" : ""
            }`}
            onClick={onChangeVisibility}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VisibilityButton;
