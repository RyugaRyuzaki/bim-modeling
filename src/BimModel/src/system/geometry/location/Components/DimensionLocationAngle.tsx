import React, {ChangeEvent, useEffect, useRef} from "react";

import {parseText} from "./utils";
import {LocationArc} from "../LocationArc";
import {changeInputSignal} from "@BimModel/src/Signals";

const DimensionLocationAngle = ({location}: {location: LocationArc}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    location.onChangeAngleDomElement = (length: string) => {
      inputRef.current!.value = length;
    };
  }, []);

  const onBlur = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const value = parseText(e.target.value).toString();
    if (value === "") return;
    if (location.location.angle) location.location.angle = +value;
    inputRef.current!.value = value;
    if (location.onChangeAngle) location.onChangeAngle(+value);
    setTimeout(() => (changeInputSignal.value = false), 100);
  };

  return (
    <div className="relative shadow-xl rounded-md flex justify-start h-[26px] bg-slate-400 pointer-events-auto p-1">
      <input
        type="text"
        className="text-black text-sm text-center h-[20px] my-auto w-[50px] bg-transparent outline-none mx-1 "
        ref={inputRef}
        onBlurCapture={onBlur}
        onFocusCapture={() => (changeInputSignal.value = true)}
      />
      <p className="text-black text-sm text-center font-mono  h-[20px] my-auto mx-1">
        °
      </p>
    </div>
  );
};

export default DimensionLocationAngle;
