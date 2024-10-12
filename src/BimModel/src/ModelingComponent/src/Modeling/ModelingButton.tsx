import React, {FC} from "react";
import {ITool} from "@ModelingComponent/types";
import {Button} from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {isModelingSignal, modelingSignal} from "@BimModel/src/Signals";
import {useComputed} from "@preact/signals-react";
import {ICategory} from "@BimModel/src/system";
import {buttonClassName} from "../constants";
import {useSignals} from "@preact/signals-react/runtime";

const ModelingButton: FC<Props> = ({type, discipline}) => {
  useSignals();

  const handleModeling = (type: ICategory) => {
    modelingSignal.value = {discipline, type};
    isModelingSignal.value = true;
  };
  const disabled = useComputed(() => {
    return (
      modelingSignal.value !== null && modelingSignal.value.type !== type.type
    );
  });
  const active = useComputed(() => {
    return (
      modelingSignal.value !== null && modelingSignal.value.type === type.type
    );
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
            onClick={() => handleModeling(type.type as ICategory)}
            disabled={disabled.value}
          >
            {type.icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{type.type}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
interface Props {
  type: ITool;
  discipline: string;
}
export default ModelingButton;
