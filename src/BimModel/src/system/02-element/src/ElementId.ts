export class ElementId {
  private static readonly limitRedo = 5 as const;
  static currentId = 0;
  static undoIds: number[] = [];
  static redoIds: number[] = [];
}
