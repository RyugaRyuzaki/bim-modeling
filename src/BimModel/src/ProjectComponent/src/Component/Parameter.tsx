import React, {ChangeEvent, useState} from "react";
import {BaseParameter} from "../../../system/element/Parameter";
import {Input} from "@components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {ILevel} from "@BimModel/src/LevelSystem/types";
import {drawingTypeSignal} from "@BimModel/src/Signals";
const Parameter = ({parameter}: {parameter: BaseParameter}) => {
  const {name, type} = parameter;
  const [value, setValue] = useState<
    string | number | boolean | BaseParameter | ILevel
  >(parameter.value);
  const [valueIndex, setValueIndex] = useState<number>(parameter.valueIndex);
  const getInput = () => {
    switch (type) {
      case "InputCount":
        return (
          <Input
            type="number"
            disabled={!parameter.enable || drawingTypeSignal.value !== "None"}
            onChange={onChangeNumber}
            value={value as number}
          />
        );
      case "InputNumber":
        return (
          <Input
            disabled={!parameter.enable || drawingTypeSignal.value !== "None"}
            value={value as number}
            onChange={onChangeNumber}
          />
        );
      case "InputString":
        return (
          <Input
            disabled={!parameter.enable || drawingTypeSignal.value !== "None"}
            onChange={onChangeString}
            value={value as string}
          />
        );
      case "List":
        if (!parameter.list) return <></>;
        return (
          <Select
            onValueChange={onChangeValue}
            disabled={!parameter.enable || drawingTypeSignal.value !== "None"}
            value={valueIndex.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="..." />
            </SelectTrigger>
            <SelectContent>
              {parameter.list.map((type: any, index: number) => (
                <SelectItem key={`${type.name}`} value={index.toString()}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "Reference":
        return <></>;
    }
  };
  const onChangeString = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    parameter.value = e.target.value;
    parameter.onValueChange(e.target.value);
  };
  const onChangeNumber = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    parameter.value = e.target.value;
    parameter.onValueChange(e.target.value);
  };
  const onChangeValue = (value: string) => {
    setValueIndex(+value);
    parameter.valueIndex = +value;
    parameter.onValueListChange(+value);
  };
  return (
    <div className="group w-full flex justify-start p-1">
      <p
        className="mx-2 capitalize 
          my-auto select-none 
          whitespace-nowrap overflow-hidden 
          overflow-ellipsis max-w-[200px] w-[200px]
          "
      >
        {name}
      </p>
      {getInput()}
    </div>
  );
};

export default Parameter;
