import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {ListUnits, unitSymbolSignal} from "@BimModel/src/Signals";
import {IUnitSymbol} from "@BimModel/src/ProjectComponent/types";
const Units = () => {
  return (
    <div className="relative h-full flex justify-center items-center">
      <div className="h-[80%] w-[1px] dark:bg-white bg-black my-auto"></div>
      <Select
        value={unitSymbolSignal.value}
        onValueChange={(value: IUnitSymbol) => (unitSymbolSignal.value = value)}
      >
        <SelectTrigger className="w-[130px] h-[80%] my-auto mx-1">
          <SelectValue placeholder="Unit" />
        </SelectTrigger>
        <SelectContent>
          {ListUnits.map((unit: IUnitSymbol, index: number) => (
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
