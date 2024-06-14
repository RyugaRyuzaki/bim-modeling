import React, {memo, MouseEventHandler} from "react";
import {BiCopy as Copy} from "react-icons/bi";
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
const ModifyCopy = () => {
  const disabled = useComputed(() => {
    return (
      !selectElementSignal.value ||
      (modifySignal.value !== null && modifySignal.value !== "Copy")
    );
  });
  const active = useComputed(() => {
    return modifySignal.value !== null && modifySignal.value === "Copy";
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
            onClick={() => (modifySignal.value = "Copy")}
            disabled={disabled.value}
          >
            <Copy className={iConClassName} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Copy</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default memo(ModifyCopy);
