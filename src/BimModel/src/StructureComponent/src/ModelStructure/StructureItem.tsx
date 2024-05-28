import React, {memo, useState} from "react";
import {IStructure} from "../../types";
import StructureTitle from "./StructureTitle";
import {modelStructureSignal} from "@BimModel/src/Signals";

const isTreeGroupActive = (structure: IStructure): boolean => {
  let checked = false;
  if (Object.keys(structure.children).length === 0) {
    checked = structure.visible;
  } else {
    checked = Object.keys(structure.children).some((key) =>
      isTreeGroupActive(structure.children[key])
    );
  }
  return checked;
};

const StructureItem = ({
  structure,
  handleCheck,
  expanded,
  onExpanded,
}: {
  structure: IStructure;
  expanded: string[];
  handleCheck: (structure: IStructure) => void;
  onExpanded: (structure: IStructure) => void;
}) => {
  const onToggle = () => {
    onExpanded(structure);
  };

  return (
    <div className="relative w-full">
      <>
        <StructureTitle
          structure={structure}
          hasChildren={Object.keys(structure.children).length > 0}
          show={expanded.includes(structure.uuid)}
          visible={isTreeGroupActive(structure)}
          onToggle={onToggle}
          handleCheck={handleCheck}
        />
        {Object.keys(structure.children).length > 0 && (
          <div
            className={`pl-4  animate-duration-300 ${
              expanded.includes(structure.uuid)
                ? "visible animate-flip-down"
                : "hidden"
            }`}
          >
            {Object.keys(structure.children).map(
              (key: string, index: number) => (
                <StructureItem
                  key={`${key}-${index}`}
                  structure={structure.children[key]}
                  handleCheck={handleCheck}
                  expanded={expanded}
                  onExpanded={onExpanded}
                />
              )
            )}
          </div>
        )}
      </>
    </div>
  );
};

export default memo(StructureItem);
