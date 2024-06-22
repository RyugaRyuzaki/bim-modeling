import React, {ChangeEvent, useEffect, useRef} from "react";

import {changeInputSignal, lengthUnitSignal} from "@BimModel/src/Signals";
import {parseText} from "./utils";
import {LocationLine} from "../LocationLine";

const DimensionLocationLine = ({location}: {location: LocationLine}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    const {factor, toFixed} = lengthUnitSignal.value;
    inputRef.current!.value = `${(location.length * factor).toFixed(toFixed)}`;
    location.onChangeLengthDomElement = (length: string) => {
      inputRef.current!.value = length;
    };
  }, []);

  const onBlur = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const value = parseText(e.target.value).toString();
    if (value === "") return;
    inputRef.current!.value = value;
    location.length = +value;
    if (location.onChangeLength) location.onChangeLength(+value);
    setTimeout(() => (changeInputSignal.value = false), 100);
  };
  return (
    <div className="relative shadow-xl rounded-md flex justify-start h-[26px] bg-slate-400 pointer-events-auto p-1">
      <input
        type="text"
        className=" text-black text-sm text-center h-[20px] my-auto w-[50px] bg-transparent outline-none mx-1 "
        ref={inputRef}
        onBlurCapture={onBlur}
        onFocusCapture={() => (changeInputSignal.value = true)}
      />
      <p className="text-black text-sm text-center font-mono  h-[20px] my-auto mx-1">
        {lengthUnitSignal.value.symbol}
      </p>
    </div>
  );
};

export default DimensionLocationLine;
