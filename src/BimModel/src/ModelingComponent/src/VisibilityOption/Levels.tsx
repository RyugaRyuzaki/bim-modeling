import React, {memo} from "react";
import {listLevelSignal} from "@BimModel/src/Signals";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@components/ui/select";
import {ILevel} from "@BimModel/src/LevelSystem/types";
const Levels = ({
  level,
  onChangeLevel,
}: {
  level: ILevel;
  onChangeLevel: (value: string) => void;
}) => {
  return (
    <div className="relative h-full flex justify-center items-center mx-1">
      <Select value={level.index.toString()} onValueChange={onChangeLevel}>
        <SelectTrigger className="w-[130px] h-[80%] my-auto">
          <SelectValue placeholder="Level" />
        </SelectTrigger>
        <SelectContent>
          {listLevelSignal.value.map((level: ILevel) => (
            <SelectItem key={`${level.name}`} value={level.index.toString()}>
              {level.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default memo(Levels);
