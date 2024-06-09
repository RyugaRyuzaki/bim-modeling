import React, {memo} from "react";
import StructureTitle from "./StructureTitle";
import {IView} from "../types";

const isTreeGroupActive = (view: IView): boolean => {
  let checked = false;
  if (Object.keys(view.children).length === 0) {
    checked = view.checked;
  } else {
    checked = Object.keys(view.children).some((key) =>
      isTreeGroupActive(view.children[key])
    );
  }
  return checked;
};

const StructureItem = ({
  view,
  handleCheck,
  expanded,
  onExpanded,
}: {
  view: IView;
  expanded: string[];
  handleCheck: (view: IView) => void;
  onExpanded: (view: IView) => void;
}) => {
  const onToggle = () => {
    onExpanded(view);
  };

  return (
    <div className="relative w-full">
      <>
        <StructureTitle
          view={view}
          hasChildren={Object.keys(view.children).length > 0}
          show={expanded.includes(view.uuid)}
          visible={isTreeGroupActive(view)}
          onToggle={onToggle}
          handleCheck={handleCheck}
        />
        {Object.keys(view.children).length > 0 && (
          <div
            className={`pl-4  animate-duration-300 ${
              expanded.includes(view.uuid)
                ? "visible animate-flip-down"
                : "hidden"
            }`}
          >
            {Object.keys(view.children).map((key: string, index: number) => (
              <StructureItem
                key={`${key}-${index}`}
                view={view.children[key]}
                handleCheck={handleCheck}
                expanded={expanded}
                onExpanded={onExpanded}
              />
            ))}
          </div>
        )}
      </>
    </div>
  );
};

export default memo(StructureItem);
