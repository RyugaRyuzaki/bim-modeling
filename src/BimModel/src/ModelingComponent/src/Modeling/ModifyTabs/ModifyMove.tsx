import React, {memo} from "react";
import {IoMdMove as Move} from "react-icons/io";
import {buttonClassName, iConClassName} from "../../constants";
import {Button} from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {modifySignal, selectElementSignal} from "@BimModel/src/Signals";
import {useComputed} from "@preact/signals-react";

const ModifyMove = () => {
  const disabled = useComputed(() => {
    return (
      !selectElementSignal.value ||
      (modifySignal.value !== null && modifySignal.value !== "Move")
    );
  });
  const active = useComputed(() => {
    return modifySignal.value !== null && modifySignal.value === "Move";
  });
  return (
    <TooltipProvider delayDuration={10}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className={`${buttonClassName} ${
              active.value ? "bg-blue-400" : ""
            }`}
            onClick={() => (modifySignal.value = "Move")}
            disabled={disabled.value}
          >
            <Move className={iConClassName} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Move</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default memo(ModifyMove);
