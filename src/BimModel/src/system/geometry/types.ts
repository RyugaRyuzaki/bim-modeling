export const dimStyle = {
  arrow: 0.1,
  offset: 0.02,
  extend: 0.3,
};
export const GeometryCSS = {
  snap: {
    endpoint: "snap-endpoint",
    endLine: "endLine",
    intersect: "snap-intersect",
    middle: "snap-middle",
  },
  tag: "tag",
  tagInfo: "tag info",
};

export interface IBaseLocation<T> {
  location: T;
  onChange: (value: T) => void;
}
