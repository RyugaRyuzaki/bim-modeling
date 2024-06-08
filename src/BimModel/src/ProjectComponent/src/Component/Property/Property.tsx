import {selectElementSignal, tempElementSignal} from "@BimModel/src/Signals";
import React from "react";
import ElementProperty from "./ElementProperty";

const Property = () => {
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
        />
      );
    return <></>;
  };
  return <>{getProperty()}</>;
};

export default Property;
