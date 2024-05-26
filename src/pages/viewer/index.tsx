import React, {useEffect, useRef} from "react";

import {BimModel} from "@BimModel/index";
import SwitchTheme from "@components/SwitchTheme/SwitchTheme";
import {disposeSignal} from "@signals/disposeSignal";
import "./Viewer.css";

const Viewer = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const modelingRef = useRef<HTMLDivElement | null>(null);
  const optionRef = useRef<HTMLDivElement | null>(null);
  const structureRef = useRef<HTMLDivElement | null>(null);
  const propertyRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const model = new BimModel(
      containerRef.current!,
      modelingRef.current!,
      optionRef.current!,
      structureRef.current!,
      propertyRef.current!
    );
    return () => {
      model?.dispose();
      disposeSignal();
    };
  }, []);
  return (
    <div className="h-full w-full relative flex flex-col">
      <div className="w-full relative h-[100px] " ref={modelingRef}>
        <SwitchTheme />
      </div>
      <div className="w-full relative h-[1px] bg-slate-500"></div>
      <div className="w-full relative h-[40px] " ref={optionRef}></div>
      <div className="w-full relative h-[1px] bg-slate-500"></div>
      <div className="flex-1 w-full relative overflow-hidden flex flex-row">
        <div
          className="w-[15%] h-full relative overflow-hidden"
          ref={structureRef}
        ></div>
        <div className="w-[1px] h-full relative  bg-slate-500"></div>
        <div
          className="flex-1 h-full relative overflow-hidden exclude-theme-change"
          ref={containerRef}
        ></div>
        <div className="w-[1px] h-full relative  bg-slate-500"></div>
        <div
          className="w-[15%] h-full relative overflow-hidden"
          ref={propertyRef}
        ></div>
      </div>
    </div>
  );
};

export default Viewer;
