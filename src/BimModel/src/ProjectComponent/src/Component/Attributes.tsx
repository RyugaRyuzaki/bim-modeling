import {IAttribute} from "@BimModel/src/system";
import React, {memo, useState} from "react";
import GroupParameterTitle from "./GroupParameterTitle";

const Attributes = ({attributes}: {attributes: IAttribute}) => {
  const [show, setShow] = useState<boolean>(true);
  const onToggle = () => {
    setShow(!show);
  };
  return (
    <>
      <GroupParameterTitle
        name={"Attributes"}
        onToggle={onToggle}
        show={show}
      />
      <div
        className={`rounded-md border-1 mb-1 ${show ? "visible" : "hidden"}`}
      >
        <div className="group w-full flex justify-start p-1">
          <p
            className="mx-2 capitalize 
          my-auto select-none 
          whitespace-nowrap overflow-hidden 
          overflow-ellipsis max-w-[200px] w-[100px]
          "
          >
            Name
          </p>
          <p
            className="mx-2 capitalize 
          my-auto select-none 
          whitespace-nowrap overflow-hidden 
          overflow-ellipsis flex-1
          "
          >
            {attributes.name}
          </p>
        </div>
        <div className="group w-full flex justify-start p-1">
          <p
            className="mx-2 capitalize 
          my-auto select-none 
          whitespace-nowrap overflow-hidden 
          overflow-ellipsis max-w-[200px] w-[100px]
          "
          >
            GlobalId
          </p>
          <p
            className="mx-2 capitalize 
          my-auto select-none 
          whitespace-nowrap overflow-hidden 
          overflow-ellipsis flex-1 max-w-[200px] w-[200px]
          "
          >
            {attributes.globalId}
          </p>
        </div>
      </div>
    </>
  );
};

export default memo(Attributes);
