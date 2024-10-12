import React, {useEffect, useState} from "react";
import {SelectionComponent} from "../..";
import {useSignals} from "@preact/signals-react/runtime";

const contextMenuBg = "bg-slate-800";

const ContextMenuPanel = ({
  selectionComponent,
}: {
  selectionComponent: SelectionComponent;
}) => {
  useSignals();

  useEffect(() => {
    console.log(selectionComponent);
  }, []);
  return (
    <div className={`relative rounded-md py-2 ${contextMenuBg} w-[120px]`}>
      <button
        className={`relative w-full text-white my-auto p-2 text-left hover:bg-green-400 hover:text-black`}
      >
        Move
      </button>
      <button
        className={`relative w-full text-white my-auto p-2 text-left hover:bg-green-400 hover:text-black`}
      >
        Copy
      </button>
      <button
        className={`relative w-full text-white my-auto p-2 text-left hover:bg-green-400 hover:text-black`}
      >
        Delete
      </button>
    </div>
  );
};

export default ContextMenuPanel;
