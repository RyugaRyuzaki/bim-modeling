import React, {memo} from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {lineTypeSignal, ListLineTypes} from "@BimModel/src/Signals";
import {ILineType} from "@BimModel/src/ProjectComponent/types";
const LineOption = () => {
  return (
    <div className="relative h-full flex justify-center items-center">
      <div className="h-[80%] w-[1px] dark:bg-white bg-black my-auto"></div>

      <Select
        value={lineTypeSignal.value}
        onValueChange={(value: ILineType) => (lineTypeSignal.value = value)}
      >
        <SelectTrigger className="w-[130px] h-[80%] my-auto mx-1">
          <SelectValue placeholder="Unit" />
        </SelectTrigger>
        <SelectContent>
          {ListLineTypes.map((unit: ILineType, index: number) => (
            <SelectItem key={`${unit}-${index}`} value={unit}>
              {unit}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default memo(LineOption);
