import React, {memo} from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  return (
    <Table className="relative min-h-[400px] max-h-[100vh] overflow-x-hidden overflow-y-auto ">
      <TableCaption>
        {Object.keys(structure.children).length || "None"} Category
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.keys(structure.children).map((key: string, index: number) => (
          <TableRow key={`${key}-${index}-${structure.uuid}`}>
            <TableCell className="font-medium">
              <Checkbox
                className="mr-3"
                checked={isTreeGroupActive(structure)}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCheck(structure);
                }}
              />
            </TableCell>
            <TableCell className="text-left max-w-[200px]">
              {structure.children[key].name}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default memo(TabTable);
