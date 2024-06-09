import React, {FC, memo} from "react";
import ElementTypes from "./ElementTypes";
import {IBimElementType} from "@ProjectComponent/types";
import {IElementType} from "clay";
import {BaseParameterGroup, IAttribute} from "@BimModel/src/system";
import GroupParameter from "../GroupParameter";
import Attributes from "../Attributes";
const ElementProperty: FC<Props> = ({
  bimElementTypes,
  groupParameter,
  attributes,
}) => {
  return (
    <div className="h-full w-full flex flex-col">
      <ElementTypes selectType={bimElementTypes} />
      {attributes && <Attributes attributes={attributes} />}
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
  attributes?: IAttribute;
}
export default memo(ElementProperty);
