import React, {memo} from "react";
import {WallElement} from "..";
import WallTypes from "./WallTypes";
import {GroupParameter} from "../../Component";

const Property = ({wall}: {wall: WallElement}) => {
  return (
    <div className="h-full w-full flex flex-col">
      <WallTypes wall={wall} />
      <div className="flex-1 w-full mb-1">
        {Object.keys(wall.groupParameter).map((key: string, index: number) => (
          <GroupParameter
            key={`${key}-${index}`}
            group={wall.groupParameter[key]}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(Property);
