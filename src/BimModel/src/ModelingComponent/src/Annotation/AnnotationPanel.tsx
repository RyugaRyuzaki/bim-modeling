import React, {memo} from "react";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {showAnnotationPanelSignal} from "@BimModel/src/Signals";
import AnnotationTabs from "./AnnotationTabs";

const AnnotationPanel = () => {
  return (
    <Dialog
      open={showAnnotationPanelSignal.value}
      onOpenChange={() => (showAnnotationPanelSignal.value = false)}
      modal={false}
    >
      <DialogContent className="xl:max-w-[800px] ">
        <DialogHeader>
          <DialogTitle>Annotation</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 z-7000">
          <AnnotationTabs />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default memo(AnnotationPanel);
