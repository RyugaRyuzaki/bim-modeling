import React, {useEffect, useState} from "react";
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
import {openElementTypeSignal} from "@BimModel/src/Signals";
import {WallElement} from "..";
import {SimpleWallType} from "clay";
import {useSignal} from "@preact/signals-react";

const WallTypes = ({wall}: {wall: WallElement}) => {
  const wallTypes = useSignal<SimpleWallType[]>(wall.types as SimpleWallType[]);
  const wallTypeIndex = useSignal<number>(wall.types.length > 0 ? 0 : -1);
  const onOpenType = () => {
    if (!wallTypes.value[wallTypeIndex.value]) return;
    openElementTypeSignal.value = true;
  };
  const onChangeType = (value: string) => {
    wallTypeIndex.value = +value;
    wall.onChangeType(wallTypes.value[+value]);
  };
  return (
    <div className="relative w-full flex justify-start items-center border-1 rounded-md p-1 mb-1">
      <Select
        value={wallTypeIndex.value.toString()}
        onValueChange={onChangeType}
      >
        <SelectTrigger className="w-[80%]  m-1">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          {wallTypes.value.map((type: SimpleWallType, index: number) => (
            <SelectItem key={`${type.name}`} value={index.toString()}>
              {type.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <TooltipProvider delayDuration={10}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className={`h-[80%] my-auto mx-2 hover:bg-green-400 disabled:cursor-none`}
              onClick={onOpenType}
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

export default WallTypes;
