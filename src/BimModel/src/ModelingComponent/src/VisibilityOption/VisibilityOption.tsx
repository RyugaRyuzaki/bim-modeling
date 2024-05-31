import React, {memo, ReactElement, useState} from "react";
import {VisibilityStates} from "../constants";
import {IVisibilityButton} from "../../types";
import VisibilityButton from "./VisibilityButton";

import {useSignalEffect} from "@preact/signals-react";
import {
  visibilityStateSignal,
  currentLevelSignal,
  listLevelSignal,
} from "@BimModel/src/Signals";
import Levels from "./Levels";
import Elevations from "./Elevations";

const VisibilityOption = () => {
  const [option, setOption] = useState<ReactElement>(<></>);
  const onChangeLevel = (value: string) => {
    currentLevelSignal.value = listLevelSignal.value[+value];
  };
  useSignalEffect(() => {
    switch (visibilityStateSignal.value) {
      case "3D":
        setOption(<></>);
        break;
      case "Elevation":
        setOption(<Elevations />);
        break;
      case "Plane":
        setOption(
          <Levels
            onChangeLevel={onChangeLevel}
            level={currentLevelSignal.value!}
          />
        );
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
