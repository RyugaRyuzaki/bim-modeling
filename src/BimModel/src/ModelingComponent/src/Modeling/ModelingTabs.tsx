import React, {memo} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ModelingTools} from "../constants";
import {IModelingToolTabs} from "@ModelingComponent/types";
import ContentModeling from "./ContentModeling";
import {
  disciplineSignal,
  modelingSignal,
  projectSignal,
} from "@BimModel/src/Signals";
import FileTabs from "./FileTabs";

const file = "Files";
const ModelingTabs = () => {
  return (
    <Tabs defaultValue={disciplineSignal.value} className="w-full">
      <TabsList className="rounded-none">
        <TabsTrigger
          value={file}
          className="mx-1 select-none"
          disabled={modelingSignal.value !== null}
        >
          {file}
        </TabsTrigger>
        {ModelingTools.map((tab: IModelingToolTabs, index: number) => (
          <TabsTrigger
            key={`${tab.discipline}-${index}--TabsTrigger`}
            value={tab.discipline}
            className="mx-1 select-none"
            disabled={
              modelingSignal.value !== null &&
              modelingSignal.value.discipline !== tab.discipline
            }
          >
            {tab.discipline}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={file} className="mt-0 h-[60px]">
        <FileTabs />
      </TabsContent>
      {ModelingTools.map((tab: IModelingToolTabs, index: number) => (
        <TabsContent
          key={`${tab.discipline}-${index}-TabsContent`}
          value={tab.discipline}
          className="mt-0 h-[60px]"
        >
          <ContentModeling types={tab.types} discipline={tab.discipline} />
        </TabsContent>
      ))}
    </Tabs>
  );
};
export default memo(ModelingTabs);
