import React, {ChangeEvent, useRef} from "react";

import isNaN from "lodash/isNaN";
import isNumber from "lodash/isNumber";
import isString from "lodash/isString";
import {Signal, useSignalEffect} from "@preact/signals-react";

import {changeInputSignal, lengthUnitSignal} from "@BimModel/src/Signals";
import {useSignals} from "@preact/signals-react/runtime";

export function parseText(text: string) {
  if (isNumber(text)) return text;

  if (isString(text)) {
    text = text.trim();

    if (!text) return "";
    const num = parseFloat(text);

    if (!isNaN(num)) {
      return num;
    }
  }

  return "";
}

export const InputNumberAnnotation = ({
  signal,
  onInputBlur,
  widthInput,
}: {
  signal: Signal<string | number | null>;
  onInputBlur: (value: string) => void;
  widthInput: number;
}) => {
  useSignals();

  const inputRef = useRef<HTMLInputElement | null>(null);
  useSignalEffect(() => {
    inputRef.current!.value = signal.value as string;
  });

  const onBlur = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const value = parseText(e.target.value).toString();
    if (value === "") return;
    inputRef.current!.value = value;
    setTimeout(() => {
      changeInputSignal.value = false;
      onInputBlur(value);
    }, 50);
  };
  return (
    <div
      className={`relative shadow-xl rounded-md flex justify-start h-[26px] bg-slate-400 pointer-events-auto p-1 w-[${widthInput}px]`}
    >
      <input
        type="text"
        className={` text-black text-sm text-center h-[20px] my-auto bg-transparent outline-none mx-0 w-[${widthInput}px]`}
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
export const InputAnnotation = ({
  signal,
  onInputBlur,
  widthInput,
}: {
  signal: Signal<string | number | null>;
  onInputBlur: (value: string) => void;
  widthInput: number;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  useSignalEffect(() => {
    if (!signal.value) return;
    inputRef.current!.value = signal.value as string;
  });

  const onBlur = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setTimeout(() => {
      changeInputSignal.value = false;
      onInputBlur(e.target.value);
    }, 50);
  };
  return (
    <div
      className={`relative shadow-xl rounded-md flex justify-start h-[26px] bg-slate-400 pointer-events-auto p-1 w-[${widthInput}px]`}
    >
      <input
        type="text"
        className={` text-black text-sm text-center h-[20px] my-auto bg-transparent outline-none mx-0 w-[${widthInput}px]`}
        ref={inputRef}
        onBlurCapture={onBlur}
        onFocusCapture={() => (changeInputSignal.value = true)}
      />
    </div>
  );
};
