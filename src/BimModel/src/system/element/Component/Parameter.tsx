import React, {ChangeEvent} from "react";
import {BaseParameter} from "../Parameter";
import {Input} from "@components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
const Parameter = ({parameter}: {parameter: BaseParameter}) => {
  const {name, type, enable} = parameter;
  const getInput = () => {
    switch (type) {
      case "InputCount":
        return (
          <Input
            type="number"
            disabled={!enable}
            onChange={onChange}
            value={parameter.value as number}
          />
        );
      case "InputNumber":
        return (
          <Input
            disabled={!parameter.enable}
            value={parameter.value as number}
            onChange={onChange}
          />
        );
      case "InputString":
        return (
          <Input
            disabled={!enable}
            onChange={onChange}
            value={parameter.value as string}
          />
        );
      case "List":
        if (!parameter.list) return <></>;
        return (
          <Select onValueChange={onChangeValue} disabled={!enable}>
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
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.value;
  };
  const onChangeValue = (_value: string) => {};
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
