import {IAttribute} from "@BimModel/src/system";
import React, {memo, useState} from "react";
import GroupParameterTitle from "./GroupParameterTitle";
import {Input} from "@components/ui/input";
const Attributes = ({attributes}: {attributes: IAttribute}) => {
  const [show, setShow] = useState<boolean>(true);
  const onToggle = () => {
    setShow(!show);
  };
  const onChangeName = () => {};
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
          overflow-ellipsis max-w-[200px] w-[50%]
          "
          >
            Name
          </p>
          <Input value={attributes.name} onChange={onChangeName} />
        </div>
        <div className="group w-full flex justify-start p-1">
          <p
            className="mx-2 capitalize 
          my-auto select-none 
          whitespace-nowrap overflow-hidden 
          overflow-ellipsis max-w-[200px] w-[50%]
          "
          >
            GlobalId
          </p>
          <p
            className="mx-2  
          my-auto select-none 
          whitespace-nowrap overflow-hidden 
          overflow-ellipsis flex-1 max-w-[200px] w-[200px]
          p-2
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
