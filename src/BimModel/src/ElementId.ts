export class ElementId {
  static currentId = 0;
  static undoIds: Set<number> = new Set();
  static redoIds: Set<number> = new Set();
}
