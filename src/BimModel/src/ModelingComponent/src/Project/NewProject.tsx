import React, {FC, useEffect} from "react";
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
import {newProjectInfoSignal} from "@BimModel/src/Signals";
import {ModelingComponent} from "../..";
const NewProject: FC<Props> = ({modeling}) => {
  const handleNewProject = () => {
    newProjectInfoSignal.value = false;
    console.log(modeling);
  };
  return (
    <Dialog
      open={newProjectInfoSignal.value}
      onOpenChange={(open: boolean) => (newProjectInfoSignal.value = open)}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4"></div>
        <DialogFooter>
          <Button type="button" onClick={handleNewProject}>
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
interface Props {
  modeling: ModelingComponent;
}
export default NewProject;
