import * as THREE from "three";

import React, {memo} from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {Input} from "@/components/ui/input";

import {Checkbox} from "@/components/ui/checkbox";
import {IStructure} from "@ProjectComponent/types";
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
const TabTable = ({
  structure,
  handleCheck,
}: {
  structure: IStructure;
  handleCheck: (structure: IStructure) => void;
}) => {
  const getColor = (mat: THREE.MeshLambertMaterial) => {
    return "#" + mat.color.getHexString();
  };
  return (
    <Table className="relative min-h-[400px] max-h-[100vh] overflow-x-hidden overflow-y-auto ">
      <TableCaption>
        {Object.keys(structure.children).length || "None"} Category
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px] h-[30px]">
            <Checkbox
              className="mr-3"
              checked={isTreeGroupActive(structure)}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCheck(structure);
              }}
            />
          </TableHead>
          <TableHead className="text-left max-w-[200px]">All</TableHead>
          <TableHead className="text-right max-w-[200px]">Color</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.keys(structure.children).map((key: string, index: number) => (
          <TableRow
            key={`${key}-${index}-${structure.uuid}`}
            className="h-[30px]"
          >
            <TableCell className="font-medium h-[30px]">
              <Checkbox
                className="mr-3"
                checked={isTreeGroupActive(structure.children[key])}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCheck(structure.children[key]);
                }}
              />
            </TableCell>
            <TableCell className="text-left h-[30px] max-w-[200px]">
              {structure.children[key].name}
            </TableCell>
            <TableCell className="text-right h-[30px] w-[50px] p-0 pr-2">
              {structure.children[key].material && (
                <Input
                  type="color"
                  className="p-1"
                  defaultValue={getColor(structure.children[key].material!)}
                  onChange={(e) =>
                    structure.children[key].onChangeColor!(
                      e.target.value,
                      structure.children[key].material
                    )
                  }
                />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default memo(TabTable);
