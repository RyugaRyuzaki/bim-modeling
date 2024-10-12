import React, {FC, memo} from "react";
import ElementTypes from "./ElementTypes";
import {Button} from "@/components/ui/button";
import {IBimElementType} from "@ProjectComponent/types";
import {IElementType} from "clay";
import {BaseParameterGroup, IAttribute} from "@BimModel/src/system";
import GroupParameter from "../GroupParameter";
import Attributes from "../Attributes";
import {useSignals} from "@preact/signals-react/runtime";

const ElementProperty: FC<Props> = ({
  bimElementTypes,
  groupParameter,
  attributes,
}) => {
  useSignals();

  return (
    <div className="h-auto w-full flex flex-col max-h-[100vh] overflow-x-hidden overflow-y-auto">
      <ElementTypes selectType={bimElementTypes} />
      {attributes && <Attributes attributes={attributes} />}
      <div className="flex-1 w-full mb-1">
        {Object.keys(groupParameter).map((key: string, index: number) => (
          <GroupParameter key={`${key}-${index}`} group={groupParameter[key]} />
        ))}
      </div>
      {attributes && (
        <div className="w-full flex justify-end rounded-md border-1 mb-1 p-1">
          <Button className={`my-auto mx-1 bg-blue-500  disabled:cursor-none`}>
            Apply{" "}
          </Button>
        </div>
      )}
    </div>
  );
};
interface Props {
  bimElementTypes: IBimElementType<IElementType>;
  groupParameter: {[uuid: string]: BaseParameterGroup};
  attributes?: IAttribute;
}
export default memo(ElementProperty);
