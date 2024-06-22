import * as THREE from "three";
import React, {ChangeEvent, useEffect, useState} from "react";
import {Input} from "@components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@components/ui/select";

import {IGridAxis} from "@BimModel/src/GridSystem/types";
import {
  deleteGridSignal,
  gridXSignal,
  gridYSignal,
  lengthUnitSignal,
} from "@BimModel/src/Signals";
import {Button} from "@components/ui/button";
import {IGrid} from "@BimModel/src/GridSystem/types";
import GridItem from "./GridItem";
import {parseText} from "@BimModel/src/utils/inputAnnotation/InputAnnotation";
const Orientations: IGridAxis[] = ["X", "Y"];
const GridTab = () => {
  const [name, setName] = useState<string>("");
  const [axis, setAxis] = useState<IGridAxis>("X");
  const [coordinate, setCoordinate] = useState<number>(0);
  const [selectGrid, setSelectGrid] = useState<IGrid | null>(null);
  const onBlur = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const value = parseText(e.target.value).toString();
    if (value === "") {
      e.target.value = coordinate + "";
      return;
    }
    setCoordinate(+value);
  };
  const handleNewGrid = () => {
    const last = axis === "X" ? gridXSignal.value[0] : gridYSignal.value[0];
    if (!last) return;
    const gridItem = {
      name,
      axis,
      coordinate: coordinate / lengthUnitSignal.value.factor,
      uuid: THREE.MathUtils.generateUUID(),
      length: last.length,
    } as IGrid;
    if (axis === "X") {
      gridXSignal.value = [...gridXSignal.value, gridItem];
    } else if (axis === "Y") {
      gridYSignal.value = [...gridYSignal.value, gridItem];
    }
  };
  const handleModifyGrid = () => {
    const newSelectGrid = {
      ...selectGrid,
      name,
      coordinate: coordinate / lengthUnitSignal.value.factor,
    };
    if (axis === "X") {
      gridXSignal.value = gridXSignal.value.map((g) => {
        if (g.uuid === newSelectGrid.uuid) return newSelectGrid;
        return g;
      }) as IGrid[];
    } else if (axis === "Y") {
      gridYSignal.value = gridYSignal.value.map((g) => {
        if (g.uuid === newSelectGrid.uuid) return newSelectGrid;
        return g;
      }) as IGrid[];
    }
  };
  const handleDeleteGrid = () => {
    if (axis === "X") {
      const newGrid = gridXSignal.value.filter(
        (g) => g.uuid !== selectGrid?.uuid
      );
      gridXSignal.value = newGrid;
    } else if (axis === "Y") {
      const newGrid = gridYSignal.value.filter(
        (g) => g.uuid !== selectGrid?.uuid
      );
      gridYSignal.value = newGrid;
    }
    deleteGridSignal.value = selectGrid;
    setSelectGrid(null);
  };
  useEffect(() => {
    if (selectGrid) {
      setName(selectGrid.name);
      setAxis(selectGrid.axis);
      setCoordinate(selectGrid.coordinate * lengthUnitSignal.value.factor);
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
          value={axis}
          onValueChange={(value: IGridAxis) => setAxis(value)}
          disabled={selectGrid !== null}
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
          value={coordinate}
          // onBlurCapture={onBlur}
          onChange={onBlur}
        />
        <p className="mx-2 my-auto">{lengthUnitSignal.value.symbol}</p>
        <Button
          className="mx-1 bg-blue-500"
          disabled={name === ""}
          onClick={handleNewGrid}
        >
          New
        </Button>
        <Button
          className="mx-1  bg-orange-500"
          disabled={!selectGrid || name === ""}
          onClick={handleModifyGrid}
        >
          Modify
        </Button>
        <Button
          className="mx-1  bg-red-500"
          disabled={!selectGrid}
          onClick={handleDeleteGrid}
        >
          Delete
        </Button>
      </div>
      <hr className="my-2" />
      <div className="w-full flex justify-between ">
        <GridItem
          name={"X"}
          selectGrid={selectGrid}
          setSelectGrid={setSelectGrid}
          grids={gridXSignal}
        />
        <GridItem
          name={"Y"}
          selectGrid={selectGrid}
          setSelectGrid={setSelectGrid}
          grids={gridYSignal}
        />
      </div>
    </div>
  );
};

export default GridTab;
