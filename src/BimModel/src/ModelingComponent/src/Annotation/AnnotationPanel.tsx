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
import {useSignals} from "@preact/signals-react/runtime";

const AnnotationPanel = () => {
  useSignals();

  return (
    <Dialog open={showAnnotationPanelSignal.value}>
      <DialogContent className="xl:max-w-[800px] ">
        <DialogHeader>
          <DialogTitle>Annotation</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 z-7000">
          <AnnotationTabs />
        </div>
        <DialogFooter className="flex justify-between">
          <Button
            type="button"
            onClick={() => (showAnnotationPanelSignal.value = false)}
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default memo(AnnotationPanel);
