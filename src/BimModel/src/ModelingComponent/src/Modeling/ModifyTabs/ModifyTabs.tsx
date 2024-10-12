import React, {memo} from "react";
import {IModify, ITool} from "../../../types";
import {buttonClassName, Modify} from "../../constants";
import {Button} from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {useComputed} from "@preact/signals-react";
import {modifySignal} from "@BimModel/src/Signals";
import ModifyCopy from "./ModifyCopy";
import ModifyMove from "./ModifyMove";
import {useSignals} from "@preact/signals-react/runtime";

const ModifyButton = ({type}: {type: ITool}) => {
  useSignals();

  const disabled = useComputed(() => {
    return modifySignal.value !== null && modifySignal.value !== type.type;
  });
  const active = useComputed(() => {
    return modifySignal.value !== null && modifySignal.value === type.type;
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
            onClick={() => (modifySignal.value = type.type as IModify)}
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

const ModifyTabs = () => {
  useSignals();

  return (
    <div className="relative h-full w-full flex justify-start items-center">
      <ModifyCopy />
      <ModifyMove />
      {Modify.map((type: ITool, index: number) => (
        <ModifyButton key={type.type + "-" + index} type={type} />
      ))}
    </div>
  );
};

export default memo(ModifyTabs);
