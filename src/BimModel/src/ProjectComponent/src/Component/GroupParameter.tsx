import React, {FC, useState} from "react";
import {BaseParameterGroup} from "../../../system/element/Parameter";
import GroupParameterTitle from "./GroupParameterTitle";
import Parameter from "./Parameter";

const GroupParameter: FC<Props> = ({group}) => {
  const [show, setShow] = useState<boolean>(true);
  const onToggle = () => {
    setShow(!show);
  };
  return (
    <>
      <GroupParameterTitle name={group.name} onToggle={onToggle} show={show} />
      {show && (
        <div className="rounded-md border-1 mb-1">
          {Object.keys(group.HasProperties).map(
            (key: string, index: number) => (
              <Parameter
                key={`${key}-${index}`}
                parameter={group.HasProperties[key]}
              />
            )
          )}
        </div>
      )}
    </>
  );
};
type Props = {
  group: BaseParameterGroup;
};
export default GroupParameter;
