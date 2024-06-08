import {v4 as uuid4} from "uuid";
import {BaseParameter} from "../BaseParameter";
import {BaseParameterGroup} from "../BaseParameterGroup";
import {IElement} from "clay";
import {IFC4X3 as IFC} from "web-ifc";
import {LengthParameter} from "../LengthParameter";
import {AreaParameter} from "../AreaParameter";
import {VolumeParameter} from "../VolumeParameter";

/**
 *
 */
export class QsetWallCommon extends BaseParameterGroup {
  element!: IElement;
  uuid = uuid4();
  name = "Qto_WallBaseQuantities" as const;
  HasProperties: {[uuid: string]: BaseParameter} = {};
  Length!: LengthParameter;
  Width!: LengthParameter;
  Height!: LengthParameter;
  GrossFootPrintArea!: AreaParameter;
  NetFootPrintArea!: AreaParameter;
  GrossSideArea!: AreaParameter;
  NetSideArea!: AreaParameter;
  GrossVolume!: VolumeParameter;
  NetVolume!: VolumeParameter;
  /**
   *
   */
  constructor() {
    super();
    this.Length = new LengthParameter("Length");
    this.Width = new LengthParameter("Width");
    this.Height = new LengthParameter("Height");
    this.GrossFootPrintArea = new AreaParameter("GrossFootPrintArea");
    this.NetFootPrintArea = new AreaParameter("NetFootPrintArea");
    this.GrossSideArea = new AreaParameter("GrossSideArea");
    this.NetSideArea = new AreaParameter("NetSideArea");
    this.GrossVolume = new VolumeParameter("GrossVolume");
    this.NetVolume = new VolumeParameter("NetVolume");
    this.HasProperties[this.Length.uuid] = this.Length;
    this.HasProperties[this.Width.uuid] = this.Width;
    this.HasProperties[this.Height.uuid] = this.Height;
    this.HasProperties[this.GrossFootPrintArea.uuid] = this.GrossFootPrintArea;
    this.HasProperties[this.NetFootPrintArea.uuid] = this.NetFootPrintArea;
    this.HasProperties[this.GrossSideArea.uuid] = this.GrossSideArea;
    this.HasProperties[this.NetSideArea.uuid] = this.NetSideArea;
    this.HasProperties[this.GrossVolume.uuid] = this.GrossVolume;
    this.HasProperties[this.NetVolume.uuid] = this.NetVolume;
    this.disabled();
  }

  toIfc!: () => IFC.IfcPropertySet;
  private disabled() {
    for (const key in this.HasProperties) {
      this.HasProperties[key].enable = false;
    }
  }
  onChangeLength = (value: number) => {
    if (!this.element) return;
    this.Length.value = value;
  };
  onChangeWidth = (value: number) => {
    if (!this.element) return;
    this.Length.value = value;
  };
}
