import React, {memo} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ModelingTools} from "../constants";
import {IModelingTab, IModelingToolTabs} from "@ModelingComponent/types";
import ContentModeling from "./ContentModeling";
import {
  disciplineSignal,
  fileTab,
  modelingSignal,
  modifyTab,
  projectSignal,
  selectElementSignal,
} from "@BimModel/src/Signals";
import FileTabs from "./FileTabs";
import ModifyTabs from "./ModifyTabs/ModifyTabs";
import {useSignals} from "@preact/signals-react/runtime";

const ModelingTabs = () => {
  useSignals();

  return (
    <Tabs
      value={disciplineSignal.value}
      className="w-full"
      onValueChange={(value) =>
        (disciplineSignal.value = value as IModelingTab)
      }
    >
      <TabsList className="rounded-none">
        <TabsTrigger
          value={fileTab}
          className="mx-1 select-none"
          disabled={modelingSignal.value !== null}
        >
          {fileTab}
        </TabsTrigger>
        {ModelingTools.map((tab: IModelingToolTabs, index: number) => (
          <TabsTrigger
            key={`${tab.discipline}-${index}--TabsTrigger`}
            value={tab.discipline}
            className="mx-1 select-none"
            disabled={
              modelingSignal.value !== null ||
              selectElementSignal.value !== null
            }
          >
            {tab.discipline}
          </TabsTrigger>
        ))}
        <TabsTrigger
          value={modifyTab}
          className="mx-1 select-none"
          disabled={modelingSignal.value !== null}
        >
          {modifyTab}
        </TabsTrigger>
      </TabsList>
      <TabsContent value={fileTab} className="mt-0 h-[60px]">
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
      <TabsContent value={modifyTab} className="mt-0 h-[60px]">
        <ModifyTabs />
      </TabsContent>
    </Tabs>
  );
};
export default memo(ModelingTabs);
