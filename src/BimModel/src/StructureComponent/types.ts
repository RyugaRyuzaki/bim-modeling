export interface IStructure {
  name: string;
  uuid: string;
  visible: boolean;
  onVisibility: (visible: boolean, structure: IStructure) => void;
  children: {[name: string]: IStructure};
}
