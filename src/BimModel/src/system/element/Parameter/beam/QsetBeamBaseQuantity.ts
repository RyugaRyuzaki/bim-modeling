import {v4 as uuid4} from "uuid";
import {BaseParameter} from "../BaseParameter";
import {BaseParameterGroup} from "../BaseParameterGroup";
import {IElement} from "clay";
import {IFC4X3 as IFC} from "web-ifc";
import {LengthParameter} from "../LengthParameter";
import {AreaParameter} from "../AreaParameter";
import {VolumeParameter} from "../VolumeParameter";
import {WeightParameter} from "../WeightParameter";

/**
 *
 */
export class QsetBeamBaseQuantity extends BaseParameterGroup {
  element!: IElement;
  uuid = uuid4();
  name = "QsetBeamBaseQuantity" as const;
  HasProperties: {[uuid: string]: BaseParameter} = {};
  Length!: LengthParameter;
  CrossSectionArea!: AreaParameter;
  OuterSurfaceArea!: AreaParameter;
  GrossVolume!: VolumeParameter;
  NetVolume!: VolumeParameter;
  GrossWeight!: WeightParameter;
  NetWeight!: WeightParameter;
  /**
   *
   */
  constructor() {
    super();
    this.Length = new LengthParameter("Length");
    this.CrossSectionArea = new AreaParameter("CrossSectionArea");
    this.OuterSurfaceArea = new AreaParameter("OuterSurfaceArea");
    this.GrossVolume = new VolumeParameter("GrossVolume");
    this.NetVolume = new VolumeParameter("NetVolume");
    this.GrossWeight = new WeightParameter("GrossWeight");
    this.NetWeight = new WeightParameter("NetWeight");
    this.HasProperties[this.Length.uuid] = this.Length;
    this.HasProperties[this.CrossSectionArea.uuid] = this.CrossSectionArea;
    this.HasProperties[this.OuterSurfaceArea.uuid] = this.OuterSurfaceArea;
    this.HasProperties[this.GrossVolume.uuid] = this.GrossVolume;
    this.HasProperties[this.NetVolume.uuid] = this.NetVolume;
    this.HasProperties[this.GrossWeight.uuid] = this.GrossWeight;
    this.HasProperties[this.NetWeight.uuid] = this.NetWeight;
    this.disabled();
  }

  toIfc!: () => IFC.IfcPropertySet;
  private disabled() {
    for (const key in this.HasProperties) {
      this.HasProperties[key].enable = false;
    }
  }
}
