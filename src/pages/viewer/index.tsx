import React, {useEffect, useRef, useState} from "react";
import {BimModel} from "@BimModel/index";
import SwitchTheme from "@components/SwitchTheme/SwitchTheme";
import {disposeSignal} from "@signals/disposeSignal";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@components/ui/resizable";
import "./Viewer.css";
import Spinner, {spinnerSignal} from "@components/Spinner/Spinner";
import {useSignals} from "@preact/signals-react/runtime";

const Viewer = () => {
  useSignals();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const modelingRef = useRef<HTMLDivElement | null>(null);
  const optionRef = useRef<HTMLDivElement | null>(null);
  const structureRef = useRef<HTMLDivElement | null>(null);
  const propertyRef = useRef<HTMLDivElement | null>(null);
  const [bimModel, setBimModel] = useState<BimModel | null>(null);
  useEffect(() => {
    const model = new BimModel(
      containerRef.current!,
      modelingRef.current!,
      optionRef.current!,
      structureRef.current!,
      propertyRef.current!
    );
    setBimModel(model);
    return () => {
      model?.dispose();
      disposeSignal();
      spinnerSignal.value = false;
      setBimModel(null);
    };
  }, []);
  const onResize = () => {
    if (!bimModel) return;
    setTimeout(bimModel.onResize, 1);
  };
  return (
    <div className="h-full w-full relative flex flex-col  ">
      <div className="w-full relative h-[100px] " ref={modelingRef}>
        <SwitchTheme />
      </div>
      <div className="w-full relative h-[1px] bg-slate-500"></div>
      <div className="w-full relative h-[40px] " ref={optionRef}></div>
      <div className="w-full relative h-[1px] bg-slate-500"></div>
      <ResizablePanelGroup
        direction="horizontal"
        className="relative h-full w-full overflow-hidden"
        onLayout={onResize}
      >
        <ResizablePanel
          defaultSize={15}
          maxSize={20}
          minSize={10}
          className="relative h-full overflow-hidden"
        >
          <div
            className="h-full w-full relative overflow-hidden"
            ref={propertyRef}
          ></div>
        </ResizablePanel>

        <ResizableHandle className="w-[4px]" />

        <ResizablePanel
          className="relative h-full overflow-hidden"
          defaultSize={70}
        >
          <div
            className="relative h-full w-full  overflow-hidden exclude-theme-change"
            ref={containerRef}
          >
            <Spinner />
          </div>
        </ResizablePanel>

        <ResizableHandle className="w-[4px]" />

        <ResizablePanel
          defaultSize={15}
          maxSize={20}
          minSize={10}
          className="relative h-full overflow-hidden"
        >
          <div
            className="h-full w-full relative overflow-hidden"
            ref={structureRef}
          ></div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Viewer;
