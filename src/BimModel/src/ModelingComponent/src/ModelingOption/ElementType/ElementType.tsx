import React from "react";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {openElementTypeSignal} from "@BimModel/src/Signals";
const ElementType = () => {
  const handleOK = () => {
    openElementTypeSignal.value = false;
  };
  return (
    <Dialog open={openElementTypeSignal.value}>
      <DialogContent className="xl:max-w-[50%]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <div className="flex justify-between gap-4 py-4 h-[600px]">
          <p>asdasd</p>
          <p>asdasd</p>
        </div>
        <DialogFooter className="flex justify-between">
          <Button type="submit" onClick={handleOK}>
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ElementType;
