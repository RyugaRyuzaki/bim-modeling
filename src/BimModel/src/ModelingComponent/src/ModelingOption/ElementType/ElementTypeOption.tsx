import React from "react";
import {Button} from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {elementTypesSignal, openElementTypeSignal} from "@BimModel/src/Signals";
import {
  BeamType,
  ColumnType,
  FoundationType,
  ReinforcementType,
  SlabType,
  WallType,
} from "@system/element-type";
const ElementTypeOption = () => {
  return (
    <div className="relative h-full flex justify-center items-center mx-1">
      <Select>
        <SelectTrigger className="w-[130px] h-[80%] my-auto">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          {elementTypesSignal.value.map(
            (
              type:
                | WallType
                | BeamType
                | ColumnType
                | SlabType
                | FoundationType
                | ReinforcementType,
              index: number
            ) => (
              <SelectItem
                key={`${type.typeEnum}-${index}`}
                value={index.toString()}
              >
                {type!.Name!.value}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>
      <TooltipProvider delayDuration={10}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className={`h-[80%] my-auto mx-2 hover:bg-green-400 disabled:cursor-none`}
              onClick={() => (openElementTypeSignal.value = true)}
            >
              ...
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Edit</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ElementTypeOption;
