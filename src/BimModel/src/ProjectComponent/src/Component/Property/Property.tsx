import {selectElementSignal, tempElementSignal} from "@BimModel/src/Signals";
import React from "react";
import ElementProperty from "./ElementProperty";
import {useSignals} from "@preact/signals-react/runtime";

const Property = () => {
  useSignals();

  const getProperty = () => {
    if (tempElementSignal.value)
      return (
        <ElementProperty
          bimElementTypes={tempElementSignal.value.bimElementTypes}
          groupParameter={tempElementSignal.value.groupParameter}
        />
      );
    if (selectElementSignal.value)
      return (
        <ElementProperty
          bimElementTypes={selectElementSignal.value.bimElementTypes}
          groupParameter={selectElementSignal.value.groupParameter}
          attributes={selectElementSignal.value.attributes}
        />
      );
    return <></>;
  };
  return <>{getProperty()}</>;
};

export default Property;
