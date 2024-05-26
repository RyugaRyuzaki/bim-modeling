import React, {memo, ReactElement, useState} from "react";
import {VisibilityStates} from "../constants";
import {IVisibilityButton} from "../../types";
import VisibilityButton from "./VisibilityButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {useSignalEffect} from "@preact/signals-react";
import {
  currentLevelSignal,
  listLevelSignal,
  visibilityStateSignal,
} from "@BimModel/src/Signals";
import {ILevel} from "@BimModel/src/system/08-level/types";
const Levels = () => {
  return (
    <div className="relative h-full flex justify-center items-center mr-[20px]">
      <Select
        value={currentLevelSignal.value?.index.toString() || "0"}
        onValueChange={(value: string) =>
          (currentLevelSignal.value = listLevelSignal.value[+value])
        }
      >
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

const VisibilityOption = () => {
  const [option, setOption] = useState<ReactElement>(<></>);
  useSignalEffect(() => {
    switch (visibilityStateSignal.value) {
      case "3D":
        setOption(<></>);
        break;
      case "Elevation":
        setOption(<Elevations />);
        break;
      case "Plane":
        setOption(<Levels />);
        break;
    }
  });
  return (
    <div className="relative h-full flex justify-center items-center mx-1">
      <div className="h-[80%] w-[1px] dark:bg-white bg-black  my-auto"></div>
      {option}
      {VisibilityStates.map(
        ({icon, tooltip}: IVisibilityButton, index: number) => (
          <VisibilityButton key={`${tooltip}-${index}`} {...{icon, tooltip}} />
        )
      )}
    </div>
  );
};

export default memo(VisibilityOption);
