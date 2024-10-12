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
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {openProjectInfoSignal} from "@BimModel/src/Signals";
import {ModelingComponent} from "../..";
import {useSignals} from "@preact/signals-react/runtime";

const ProjectInfo: FC<Props> = ({modeling}) => {
  useSignals();

  const handleShowProjectInfo = () => {
    openProjectInfoSignal.value = false;
    console.log(modeling);
  };
  return (
    <Dialog
      open={openProjectInfoSignal.value}
      onOpenChange={(open: boolean) => (openProjectInfoSignal.value = open)}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleShowProjectInfo}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
interface Props {
  modeling: ModelingComponent;
}
export default ProjectInfo;
