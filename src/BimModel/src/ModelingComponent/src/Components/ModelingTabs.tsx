import React, {memo} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

const ModelingTabs = () => {
  return (
    <Tabs defaultValue="Architecture" className="w-full">
      <TabsList className="rounded-none bg-slate-200">
        <TabsTrigger value="Architecture" className="mx-1 select-none">
          Architecture
        </TabsTrigger>
        <TabsTrigger value="Structure" className="mx-1 ">
          Structure
        </TabsTrigger>
        <TabsTrigger value="Plumbing" className="mx-1 ">
          Plumbing
        </TabsTrigger>
      </TabsList>
      <TabsContent value="Architecture" className="mt-0 h-[60px]">
        This is on processing...
      </TabsContent>
      <TabsContent value="Structure" className="mt-0 h-[60px]">
        Change your password here.
      </TabsContent>
      <TabsContent value="Plumbing" className="mt-0 h-[60px]">
        This is on processing...
      </TabsContent>
    </Tabs>
  );
};
export default memo(ModelingTabs);
