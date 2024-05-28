import React, {FC, memo} from "react";
import {MdArrowForwardIos} from "react-icons/md";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {IStructure} from "../../types";
const iconClassName = "h-[16px] w-[16px]";
const StructureTitle: FC<IStructureTitle> = ({
  structure,
  show,
  hasChildren,
  visible,
  handleCheck,
  onToggle,
}) => {
  return (
    <div className="group flex justify-between p-1  hover:bg-green-300 hover:text-slate-800 rounded-md my-1">
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
          className="text-[12px] mx-2 capitalize 
          my-auto select-none 
          whitespace-nowrap overflow-hidden 
          overflow-ellipsis max-w-[200px]
          "
        >
          {structure.name}
        </p>
      </div>
      <div className="flex justify-end mr-2">
        <button
          className="border-none outline-none cursor-pointer"
          onClick={() => handleCheck!(structure)}
        >
          {visible ? (
            <FaEye className={iconClassName} />
          ) : (
            <FaEyeSlash className={iconClassName} />
          )}
        </button>
      </div>
    </div>
  );
};
type IStructureTitle = {
  structure: IStructure;
  show?: boolean;
  hasChildren: boolean;
  visible: boolean;
  handleCheck: (structure: IStructure) => void;
  onToggle?: () => void;
};
export default memo(StructureTitle);
