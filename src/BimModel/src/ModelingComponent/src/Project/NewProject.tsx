import React, {FC} from "react";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {newProjectInfoSignal} from "@BimModel/src/Signals";
import {ModelingComponent} from "../..";
import {useSignals} from "@preact/signals-react/runtime";

const NewProject: FC<Props> = ({modeling}) => {
  useSignals();

  const handleNewProject = () => {
    newProjectInfoSignal.value = false;
    console.log(modeling);
  };
  return (
    <Dialog
      open={newProjectInfoSignal.value}
      onOpenChange={(open: boolean) => (newProjectInfoSignal.value = open)}
    >
      <DialogContent className="xl:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>This on processing!...</DialogDescription>
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
