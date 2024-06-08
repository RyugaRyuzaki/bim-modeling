import React, {FC, memo} from "react";
import ElementTypes from "./ElementTypes";
import {IBimElementType} from "@ProjectComponent/types";
import {IElementType} from "clay";
import {BaseParameterGroup} from "@BimModel/src/system";
import GroupParameter from "../GroupParameter";
const ElementProperty: FC<Props> = ({bimElementTypes, groupParameter}) => {
  return (
    <div className="h-full w-full flex flex-col">
      <ElementTypes selectType={bimElementTypes} />
      <div className="flex-1 w-full mb-1">
        {Object.keys(groupParameter).map((key: string, index: number) => (
          <GroupParameter key={`${key}-${index}`} group={groupParameter[key]} />
        ))}
      </div>
    </div>
  );
};
interface Props {
  bimElementTypes: IBimElementType<IElementType>;
  groupParameter: {[uuid: string]: BaseParameterGroup};
}
export default memo(ElementProperty);
