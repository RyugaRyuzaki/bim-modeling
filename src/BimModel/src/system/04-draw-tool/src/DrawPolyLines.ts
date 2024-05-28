import {Components} from "@BimModel/src/Components";
import {BaseDraw} from "./BaseDraw";

export class DrawPolyLines extends BaseDraw {
  /**
   *
   */
  constructor(components: Components) {
    super(components);
  }
  onClick = (_e: MouseEvent) => {};
  onMouseMove = (_e: MouseEvent) => {};
  onMousedown = (_e: MouseEvent) => {};
  onKeyDown = (_e: KeyboardEvent) => {};

  onFinished = () => {};
  onCallBack = (_value?: number) => {};
  dispose = () => {};
}
