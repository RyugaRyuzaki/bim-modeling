export abstract class BaseElement {
  abstract type: number;
  abstract category: number;
  abstract dispose: () => void;
}
