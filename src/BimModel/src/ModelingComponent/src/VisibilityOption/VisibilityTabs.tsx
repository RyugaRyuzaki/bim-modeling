import React, {memo} from "react";

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {modelStructureSignal} from "@BimModel/src/Signals";
import {IStructure} from "@ProjectComponent/types";
import TabTable from "./TabTable";
const VisibilityTabs = () => {
  const updateChildren = (structure: IStructure, visible: boolean) => {
    for (const key in structure.children) {
      structure.children[key].visible = visible;
      updateChildren(structure.children[key], visible);
    }
  };
  const handleCheck = (structure: IStructure) => {
    structure.visible = !structure.visible;
    updateChildren(structure, structure.visible);
    structure.onVisibility(structure.visible, structure);
    modelStructureSignal.value = {...modelStructureSignal.value} as IStructure;
  };
  return (
    <div className="relative h-full w-full ">
      {modelStructureSignal.value && (
        <Tabs defaultValue={"Architecture"} className="w-full">
          <TabsList className="rounded-none">
            {Object.keys(modelStructureSignal.value.children).map(
              (key: string, index: number) => (
                <TabsTrigger
                  key={`${key}-${index}--TabsTrigger`}
                  value={key}
                  className="mx-1 select-none"
                >
                  {key}
                </TabsTrigger>
              )
            )}
          </TabsList>
          {Object.keys(modelStructureSignal.value.children).map(
            (key: string, index: number) => (
              <TabsContent
                key={`${key}-${index}-TabsContent`}
                value={key}
                className="relative min-h-[400px] max-h-[100vh] overflow-x-hidden overflow-y-auto mt-0 border-1 "
              >
                <TabTable
                  structure={modelStructureSignal.value!.children[key]}
                  handleCheck={handleCheck}
                />
              </TabsContent>
            )
          )}
        </Tabs>
      )}
    </div>
  );
};

export default memo(VisibilityTabs);
