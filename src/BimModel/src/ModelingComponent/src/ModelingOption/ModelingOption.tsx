import React, {useState} from "react";
import ElementTypeOption from "./ElementType/ElementTypeOption";
import {modelingSignal} from "@BimModel/src/Signals";

const ModelingOption = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="relative h-full flex justify-start items-center">
      {modelingSignal.value && <ElementTypeOption />}
    </div>
  );
};

export default ModelingOption;
