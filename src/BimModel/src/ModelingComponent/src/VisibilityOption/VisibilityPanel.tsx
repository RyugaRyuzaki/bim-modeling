import React, {memo} from "react";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {openVisibilitySignal} from "@BimModel/src/Signals";
import VisibilityTabs from "./VisibilityTabs";
const VisibilityPanel = () => {
  return (
    <Dialog
      open={openVisibilitySignal.value}
      onOpenChange={() => (openVisibilitySignal.value = false)}
      modal={false}
    >
      <DialogContent className="xl:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Model Visibility</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 z-7000">
          <VisibilityTabs />
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => (openVisibilitySignal.value = false)}
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default memo(VisibilityPanel);
