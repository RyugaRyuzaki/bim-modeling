import React, {FC, memo} from "react";
import {MdArrowForwardIos} from "react-icons/md";
import {IoDocumentTextOutline} from "react-icons/io5";
import {IView} from "../types";
import {selectViewSignal} from "@BimModel/src/Signals";
const iconClassName = "h-[16px] w-[16px]";
import {useSignals} from "@preact/signals-react/runtime";

const StructureTitle: FC<IStructureTitle> = ({
  view,
  show,
  hasChildren,
  handleCheck,
  onToggle,
}) => {
  useSignals();

  const onSelect = () => {
    if (view.viewType === "Browsers") return;
    selectViewSignal.value = view;
  };
  return (
    <div
      className={`group flex justify-between p-1  hover:bg-green-300 hover:text-slate-800 rounded-md my-1
        ${
          selectViewSignal.value?.uuid === view.uuid
            ? "bg-green-300 text-slate-800"
            : ""
        }
        `}
    >
      <div className="flex justify-start">
        {hasChildren && (
          <button
            className="border-none outline-none cursor-pointer"
            onClick={onToggle}
          >
            <MdArrowForwardIos
              className={`${iconClassName} ${show ? "rotate-90" : "rotate-0"} `}
            />
          </button>
        )}

        <p
          className={`mx-2 capitalize 
          my-auto select-none 
          whitespace-nowrap overflow-hidden 
          overflow-ellipsis max-w-[200px]
          ${view.viewType !== "Browsers" ? "cursor-pointer" : "cursor-default"}
          `}
          onClick={onSelect}
        >
          {view.name}
        </p>
      </div>
      <div className="flex justify-end mr-2">
        <button
          className="border-none outline-none cursor-pointer"
          onClick={() => handleCheck!(view)}
        >
          {view.viewType !== "Browsers" && (
            <IoDocumentTextOutline className={iconClassName} />
          )}
        </button>
      </div>
    </div>
  );
};
type IStructureTitle = {
  view: IView;
  show?: boolean;
  hasChildren: boolean;
  handleCheck: (view: IView) => void;
  onToggle?: () => void;
};
export default memo(StructureTitle);
