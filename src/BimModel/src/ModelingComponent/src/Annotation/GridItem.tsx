import React, {Dispatch, memo, SetStateAction} from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {Signal} from "@preact/signals-react";
import {IGrid, IGridAxis} from "@BimModel/src/GridSystem/types";
import {lengthUnitSignal} from "@BimModel/src/Signals";
const GridItem = ({
  name,
  selectGrid,
  setSelectGrid,
  grids,
}: {
  name: IGridAxis;
  selectGrid: IGrid | null;
  setSelectGrid: Dispatch<SetStateAction<IGrid | null>>;
  grids: Signal<IGrid[]>;
}) => {
  return (
    <div className="p-2 w-[50%]">
      <Table className="rounded-md border-1 p-1">
        <TableHeader>
          <TableRow
            className="h-[30px] cursor-pointer"
            title="DisSelect"
            onClick={() => setSelectGrid(null)}
          >
            <TableHead className="text-center" colSpan={2}>
              Axes {name}
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
          {grids.value.map((grid: IGrid, index: number) => {
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
  );
};

export default memo(GridItem);
