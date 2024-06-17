import * as THREE from "three";

import React, {useEffect, useState} from "react";
import {Input} from "@components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {IGridAxis} from "@BimModel/src/GridSystem/types";
import {
  gridXSignal,
  gridYSignal,
  lengthUnitSignal,
} from "@BimModel/src/Signals";
import {Button} from "@components/ui/button";
import {IGrid} from "@BimModel/src/GridSystem/types";
const Orientations: IGridAxis[] = ["X", "Y"];
const GridTab = () => {
  const [name, setName] = useState<string>("");
  const [oriented, setOriented] = useState<IGridAxis>("X");
  const [distance, setDistance] = useState<number>(0);
  const [selectGrid, setSelectGrid] = useState<IGrid | null>(null);

  const handleNewGrid = () => {};
  useEffect(() => {
    if (selectGrid) {
      setName(selectGrid.name);
      setOriented(selectGrid.axis);
      setDistance(selectGrid.coordinate * lengthUnitSignal.value.factor);
    }
  }, [selectGrid]);
  return (
    <div className="relative h-full w-full p-1">
      <div className="w-full flex justify-between rounded-md border-1 mb-1 p-1 my-auto">
        <p className="mx-2 capitalize my-auto">Name</p>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p className="mx-2 capitalize my-auto">Orientations</p>

        <Select
          value={oriented.toString()}
          onValueChange={(value: IGridAxis) => setOriented(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="..." />
          </SelectTrigger>
          <SelectContent>
            {Orientations.map((grid: IGridAxis, index: number) => (
              <SelectItem key={`${grid}-${index}`} value={grid}>
                {grid}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="mx-2 capitalize my-auto">Coordinate</p>
        <Input
          type="text"
          value={distance}
          onChange={(e) => setDistance(+e.target.value)}
        />
        <p className="mx-2 my-auto">{lengthUnitSignal.value.symbol}</p>
        <Button
          className="mx-1 bg-blue-500"
          disabled={name === ""}
          onClick={handleNewGrid}
        >
          New
        </Button>
        <Button className="mx-1  bg-orange-500" disabled={!selectGrid}>
          Modify
        </Button>
        <Button className="mx-1  bg-red-500" disabled={!selectGrid}>
          Delete
        </Button>
      </div>
      <hr className="my-2" />
      <div className="w-full flex justify-between ">
        <div className="p-2 w-[50%]">
          <Table className="rounded-md border-1 p-1">
            <TableHeader>
              <TableRow
                className="h-[30px] cursor-pointer"
                title="DisSelect"
                onClick={() => setSelectGrid(null)}
              >
                <TableHead className="text-center" colSpan={2}>
                  Axes X
                </TableHead>
              </TableRow>
              <TableRow className="h-[30px]">
                <TableHead className="text-center  border-1">Grid ID</TableHead>
                <TableHead className="text-center  border-1">
                  X Coordinate ( {lengthUnitSignal.value.symbol} )
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gridXSignal.value.map((grid: IGrid, index: number) => {
                const bg =
                  selectGrid && selectGrid.uuid === grid.uuid
                    ? "bg-green-300 text-slate-800"
                    : "";
                return (
                  <TableRow
                    className={`h-[30px] cursor-pointer ${bg}`}
                    key={`${grid.name}-${index}`}
                    onClick={() => setSelectGrid(grid)}
                  >
                    <TableCell className={`text-center border-1 ${bg}`}>
                      {grid.name}
                    </TableCell>
                    <TableCell className={`text-center border-1 ${bg}`}>
                      {grid.coordinate * lengthUnitSignal.value.factor}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <div className="p-2 w-[50%]">
          <Table className="rounded-md border-1 p-1">
            <TableHeader>
              <TableRow
                className="h-[30px] cursor-pointer"
                title="DisSelect"
                onClick={() => setSelectGrid(null)}
              >
                <TableHead className="text-center" colSpan={2}>
                  Axes Y
                </TableHead>
              </TableRow>
              <TableRow className="h-[30px]">
                <TableHead className="text-center  border-1">Grid ID</TableHead>
                <TableHead className="text-center  border-1">
                  Y Coordinate ( {lengthUnitSignal.value.symbol} )
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gridYSignal.value.map((grid: IGrid, index: number) => {
                const bg =
                  selectGrid && selectGrid.uuid === grid.uuid
                    ? "bg-green-300 text-slate-800"
                    : "";
                return (
                  <TableRow
                    className={`h-[30px] cursor-pointer ${bg}`}
                    key={`${grid.name}-${index}`}
                    onClick={() => setSelectGrid(grid)}
                  >
                    <TableCell className={`text-center border-1 ${bg}`}>
                      {grid.name}
                    </TableCell>
                    <TableCell className={`text-center border-1 ${bg}`}>
                      {grid.coordinate * lengthUnitSignal.value.factor}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default GridTab;
