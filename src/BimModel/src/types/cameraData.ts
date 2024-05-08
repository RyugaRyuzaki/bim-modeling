export interface ICameraData {
  position: number[];
  quaternion: number[];
  direction: number[];
  projection: boolean;
  width: number;
  height: number;
  other?: any;
}
export type INavigation =
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "front"
  | "back"
  | "left_front"
  | "left_back"
  | "right_front"
  | "right_back"
  | "top_left"
  | "top_right"
  | "top_front"
  | "top_back"
  | "bottom_left"
  | "bottom_right"
  | "bottom_front"
  | "bottom_back"
  | "top_left_front"
  | "top_left_back"
  | "top_right_front"
  | "top_right_back"
  | "bottom_left_front"
  | "bottom_left_back"
  | "bottom_right_front"
  | "bottom_right_back";
