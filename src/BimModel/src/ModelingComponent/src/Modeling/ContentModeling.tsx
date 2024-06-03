import React, {FC, useState} from "react";
import {IModeling, ITool} from "@ModelingComponent/types";
import ModelingButton from "./ModelingButton";
import {useSignalEffect} from "@preact/signals-react";
import {modelingSignal} from "@BimModel/src/Signals";
import {getModelings} from "../utils";
import ToolButton from "./ToolButton";

const ContentModeling: FC<Props> = ({types, discipline}) => {
  const [tools, setTools] = useState<IModeling[]>([]);
  useSignalEffect(() => {
    const modelings = modelingSignal.value
      ? getModelings(modelingSignal.value.type)
      : [];
    setTools(modelings);
    if (!modelingSignal.value) return;
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
            {tools.length > 0 && (
              <div className="h-[80%] w-[1px] dark:bg-white bg-black mx-2 my-auto"></div>
            )}
            {tools.map((tool: IModeling, index: number) => (
              <ToolButton
                key={`${tool.drawType}-${index}-${discipline}`}
                tool={tool}
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
