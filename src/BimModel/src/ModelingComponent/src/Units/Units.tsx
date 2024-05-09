import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {ListUnits, unitSignal} from "@BimModel/src/Signals";
import {IUnit} from "@BimModel/src/types";
const Units = () => {
  return (
    <div className="relative h-full flex justify-center items-center mr-[20px]">
      <Select
        value={unitSignal.value}
        onValueChange={(value: IUnit) => (unitSignal.value = value)}
      >
        <SelectTrigger className="w-[130px] h-[80%] my-auto">
          <SelectValue placeholder="Unit" />
        </SelectTrigger>
        <SelectContent>
          {ListUnits.map((unit: IUnit, index: number) => (
            <SelectItem key={`${unit}-${index}`} value={unit}>
              {unit}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Units;
