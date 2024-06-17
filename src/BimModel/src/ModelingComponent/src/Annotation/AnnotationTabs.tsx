import React, {memo} from "react";

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import GridTab from "./GridTab";

const AnnotationTabs = () => {
  return (
    <div className="relative h-full w-full ">
      <Tabs defaultValue={"Grid"} className="w-full">
        <TabsList className="rounded-none">
          <TabsTrigger value={"Grid"} className="mx-1 select-none">
            Grid
          </TabsTrigger>
          <TabsTrigger value={"Level"} className="mx-1 select-none">
            Level
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value={"Grid"}
          className="relative min-h-[400px] max-h-[100vh] overflow-x-hidden overflow-y-auto mt-0 border-1"
        >
          <GridTab />
        </TabsContent>
        <TabsContent
          value={"Level"}
          className="relative min-h-[400px] max-h-[100vh] overflow-x-hidden overflow-y-auto mt-0 border-1"
        ></TabsContent>
      </Tabs>
    </div>
  );
};

export default memo(AnnotationTabs);
