import {Disposable, IBaseLocation, ILocationLine} from "@BimModel/src";
import {BaseLocation} from "./BaseLocation";
export class LocationPoint
  extends BaseLocation
  implements Disposable, IBaseLocation<ILocationLine>
{
  /** implements @IBaseLocation */
  location!: ILocationLine;
  onChange!: (value: ILocationLine) => void;

  /** abstract @BaseLocation */
  onSelect!: (select: boolean) => void;
  onHover!: (hover: boolean) => void;
  onVisibility = (_visible: boolean) => {};
  async dispose() {}
}
