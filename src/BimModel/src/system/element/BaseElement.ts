import {IElementType, IElement, IIfcBaseConfig, IElementTypeName} from "clay";
import {IFC4X3 as IFC} from "web-ifc";
import {IBimElementType} from "@ProjectComponent/types";
import {Components, ProjectComponent} from "@BimModel/src";
import {BaseParameterGroup} from "./Parameter";
import {IDrawType} from "@ModelingComponent/types";
export abstract class BaseElement implements IBimElementType<IElementType> {
  abstract groupParameter: {[uuid: string]: BaseParameterGroup};
  abstract element: IElement;
  abstract container: HTMLDivElement;
  abstract drawType: IDrawType;
  abstract dispose: () => void;
  get attributes() {
    return this.element.attributes;
  }
  get uuid() {
    this.checkInit();
    return this.element.attributes.GlobalId.value;
  }
  get name() {
    this.checkInit();
    return this.attributes.Name!.value || "";
  }
  set config(config: IIfcBaseConfig) {
    this.checkInit();
    const {Name, ObjectType, Description} = config;
    this.setAttributes(this.attributes.Name, Name);
    this.setAttributes(this.attributes.Description, Description);
    this.setAttributes(this.attributes.ObjectType, ObjectType);
  }
  get defaultElementTypes() {
    return this.components.tools.get(ProjectComponent).defaultElementTypes;
  }
  get ifcModel() {
    return this.components.ifcModel;
  }
  public types!: IElementType[];
  public selectType!: IElementType | null;
  private _visible = false;
  set visible(visible: true) {
    this.checkInit();
    if (!this._visible === visible) return;
    this._visible = visible;
    if (visible) {
      this.components.modelScene.add(...this.element.meshes);
    } else {
      for (const mesh of this.element.meshes) {
        mesh.removeFromParent();
      }
    }
  }
  /**
   *
   */
  constructor(public components: Components, type: IElementTypeName) {
    const {types, selectType} = this.defaultElementTypes[type];
    this.types = types;
    this.selectType = selectType || types[0];
  }

  checkInit() {
    if (!this.element) throw new Error("Element was not created");
  }
  onChangeType(type: IElementType) {
    if (this.selectType && this.element) {
      const id = this.element.attributes.expressID;
      this.selectType.deleteInstance(id);
    }
    (this.element as any) = null;
    this.selectType = type;
    this.element = this.selectType.addInstance();
  }
  private setAttributes(attr: IFC.IfcLabel | null, value: string) {
    if (!attr) attr = new IFC.IfcLabel(value);
    attr.value = value;
  }
}
