import React, {FC} from "react";
import {IModeling} from "@ModelingComponent/types";
import {Button} from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {useComputed} from "@preact/signals-react";
import {drawingTypeSignal} from "@BimModel/src/Signals";

const ToolButton: FC<Props> = ({tool}) => {
  const disabled = useComputed(() => {
    return (
      drawingTypeSignal.value !== "None" &&
      drawingTypeSignal.value !== tool.drawType
    );
  });
  const active = useComputed(() => {
    return (
      drawingTypeSignal.value !== "None" &&
      drawingTypeSignal.value === tool.drawType
    );
  });
  return (
    <TooltipProvider delayDuration={10}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className={`my-auto mx-1 hover:bg-green-400 disabled:cursor-none p-1 ${
              active.value ? "bg-blue-400" : ""
            }`}
            onClick={() => tool.onClick!(tool.drawType)}
            disabled={disabled.value}
          >
            {tool.icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{tool.drawType}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
interface Props {
  tool: IModeling;
}
export default ToolButton;
