import React, {FC, useState} from "react";
import {IModeling, ITool} from "@ModelingComponent/types";
import ModelingButton from "./ModelingButton";
import {useComputed, useSignalEffect} from "@preact/signals-react";
import {modelingSignal} from "@BimModel/src/Signals";
import {getModelings} from "../utils";
import ToolButton from "./ToolButton";
import {useSignals} from "@preact/signals-react/runtime";

const ContentModeling: FC<Props> = ({types, discipline}) => {
  useSignals();

  const tools = useComputed<{[drawType: string]: IModeling}>(() => {
    const modelings = modelingSignal.value
      ? getModelings(modelingSignal.value.type)
      : {};

    return modelings;
  });

  return (
    <div className="relative h-full w-full flex justify-start items-center">
      <>
        {types.length > 0 ? (
          <>
            {types.map((type: ITool, index: number) => (
              <ModelingButton
                key={type.type + "-" + index}
                type={type}
                discipline={discipline}
              />
            ))}
            {Object.keys(tools.value).length > 0 && (
              <div className="h-[80%] w-[1px] dark:bg-white bg-black mx-2 my-auto"></div>
            )}
            {Object.keys(tools.value).map((key: string, index: number) => (
              <ToolButton
                key={`${key}-${index}-${discipline}`}
                tool={tools.value[key]}
              />
            ))}
          </>
        ) : (
          <div className="my-auto h-[90%] flex items-center">
            <p className="text-center mx-2">This on processing!...</p>
          </div>
        )}
      </>
    </div>
  );
};
interface Props {
  types: ITool[];
  discipline: string;
}
export default ContentModeling;
