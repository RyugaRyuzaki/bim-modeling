import {BaseParameter, IBaseParameterValue} from "../../00-base";

export class Parameter extends BaseParameter {
  name!: string;
  value!: string;
  valueType!: IBaseParameterValue;
}
