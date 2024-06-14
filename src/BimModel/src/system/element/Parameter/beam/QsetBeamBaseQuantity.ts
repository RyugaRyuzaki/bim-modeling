import {BaseParameter} from "../BaseParameter";
import {BaseParameterGroup} from "../BaseParameterGroup";
import {
  IElement,
  IShapeProfile,
  RectangleProfile,
  SimpleBeam,
  SimpleBeamType,
} from "clay";
import {LengthParameter} from "../LengthParameter";
import {AreaParameter} from "../AreaParameter";
import {VolumeParameter} from "../VolumeParameter";
import {WeightParameter} from "../WeightParameter";

/**
 *
 */
export class QsetBeamBaseQuantity extends BaseParameterGroup {
  element!: IElement;
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

  private disabled() {
    for (const key in this.HasProperties) {
      this.HasProperties[key].enable = false;
    }
  }
  updateElement = (element: IElement) => {
    this.element = element;
    if (!this.element.type) return;
    const {length} = this.element as SimpleBeam;
    this.Length.value = length;
    let area = 0;
    const profile = (this.element.type as SimpleBeamType).profile;
    if (profile instanceof RectangleProfile) {
      area = profile.dimension.x * profile.dimension.y;
    } else if (profile instanceof IShapeProfile) {
      area = profile.width * profile.height;
    }
    this.CrossSectionArea.value = area;
    this.OuterSurfaceArea.value = area;
    this.GrossVolume.value = area * length;
    this.NetVolume.value = area * length;
  };
}
