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
import {drawingTypeSignal, openElementTypeSignal} from "@BimModel/src/Signals";
import {IElementType} from "clay";
import {useSignal} from "@preact/signals-react";
import {IBimElementType} from "@ProjectComponent/types";

const ElementTypes = ({
  selectType,
}: {
  selectType: IBimElementType<IElementType>;
}) => {
  const elementTypes = useSignal<IElementType[]>(
    selectType.types as IElementType[]
  );
  const elementTypeIndex = useSignal<number>(
    selectType.types.length > 0 ? 0 : -1
  );
  const onOpenType = () => {
    if (!elementTypes.value[elementTypeIndex.value]) return;
    openElementTypeSignal.value = true;
  };
  const onChangeType = (value: string) => {
    elementTypeIndex.value = +value;
    selectType.selectType = selectType.types[+value];
  };
  return (
    <div className="relative w-full flex justify-start items-center border-1 rounded-md p-1 mb-1">
      <p className="mx-2 w-[60px] ">Type</p>
      <Select
        value={elementTypeIndex.value.toString()}
        onValueChange={onChangeType}
        disabled={drawingTypeSignal.value !== "None"}
      >
        <SelectTrigger className="w-[80%]  m-1">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          {elementTypes.value.map((type: IElementType, index: number) => (
            <SelectItem key={`${type.typeUuid}`} value={index.toString()}>
              {type.typeName}
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

export default ElementTypes;
