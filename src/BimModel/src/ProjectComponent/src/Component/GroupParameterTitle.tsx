import React, {FC} from "react";
import {MdArrowForwardIos} from "react-icons/md";
import {useSignals} from "@preact/signals-react/runtime";

const GroupParameterTitle: FC<Props> = ({name, show, onToggle}) => {
  useSignals();

  return (
    <div className="group flex justify-start p-2  bg-green-300 text-slate-800 rounded-md border-1 mb-1">
      <button
        className="border-none outline-none cursor-pointer"
        onClick={onToggle}
      >
        <MdArrowForwardIos
          className={`h-[16px] w-[16px] ${show ? "rotate-90" : "rotate-0"} `}
        />
      </button>

      <p
        className="mx-2 capitalize 
        my-auto select-none 
        whitespace-nowrap overflow-hidden 
        overflow-ellipsis max-w-[200px]
        "
      >
        {name}
      </p>
    </div>
  );
};
type Props = {
  name: string;
  show: boolean;
  onToggle: () => void;
};
export default GroupParameterTitle;
