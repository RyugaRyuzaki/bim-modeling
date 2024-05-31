import React, {memo} from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
const Elevations = () => {
  return (
    <div className="relative h-full flex justify-center items-center mx-1">
      <Select>
        <SelectTrigger className="w-[130px] h-[80%] my-auto">
          <SelectValue placeholder="Level" />
        </SelectTrigger>
        <SelectContent></SelectContent>
      </Select>
    </div>
  );
};

export default memo(Elevations);
