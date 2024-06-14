import {IElement, Model} from "clay";
import {v4 as uuid4} from "uuid";
import {IFC4X3 as IFC} from "web-ifc";

import {BaseParameter} from "./BaseParameter";
import {LevelParameter} from "./LevelParameter";
import {LengthParameter} from "./LengthParameter";
import {AreaParameter} from "./AreaParameter";
import {VolumeParameter} from "./VolumeParameter";
import {WeightParameter} from "./WeightParameter";
/**
 *
 */
export abstract class BaseParameterGroup {
  uuid = uuid4();
  abstract name: string;
  abstract HasProperties: {[uuid: string]: BaseParameter};
  abstract element: IElement;
  toIfc = (IfcOwnerHistory: IFC.IfcOwnerHistory): IFC.IfcPropertySet => {
    if (!this.element) throw new Error("Can not find element");
    if (!this.name) throw new Error("Name has no assignment");
    return new IFC.IfcPropertySet(
      new IFC.IfcGloballyUniqueId(this.uuid),
      IfcOwnerHistory,
      new IFC.IfcLabel(this.name),
      null,
      []
    );
  };

  abstract updateElement: (element: IElement) => void;

  getLevelParameter(): LevelParameter | null {
    if (Object.keys(this.HasProperties).length === 0) return null;
    for (const key in this.HasProperties) {
      const para = this.HasProperties[key];
      if (para instanceof LevelParameter) return para;
    }
    return null;
  }
  export(model: Model, IfcOwnerHistory: IFC.IfcOwnerHistory) {
    if (!this.element) return;
    if (!this.HasProperties || Object.keys(this.HasProperties).length === 0)
      return;
    const pSet = this.toIfc(IfcOwnerHistory);
    if (!pSet) return;
    pSet.OwnerHistory = IfcOwnerHistory;
    pSet.HasProperties = [];

    const {ifcUnit} = model.ifcInfo;
    const {IfcAreaUnit, IfcLengthUnit, IfcVolumeUnit, IfcMassUnit} = ifcUnit;
    for (const key in this.HasProperties) {
      const para = this.HasProperties[key];
      const ifc = para.toIfc();
      if (!ifc) continue;
      if (para instanceof LengthParameter) {
        (ifc as IFC.IfcQuantityLength).Unit = IfcLengthUnit;
      }
      if (para instanceof AreaParameter) {
        (ifc as IFC.IfcQuantityArea).Unit = IfcAreaUnit;
      }
      if (para instanceof VolumeParameter) {
        (ifc as IFC.IfcQuantityVolume).Unit = IfcVolumeUnit;
      }
      if (para instanceof WeightParameter) {
        (ifc as IFC.IfcQuantityWeight).Unit = IfcMassUnit;
      }
      pSet.HasProperties.push(ifc as IFC.IfcProperty);
    }
    const relPset = new IFC.IfcRelDefinesByProperties(
      new IFC.IfcGloballyUniqueId(uuid4()),
      IfcOwnerHistory,
      null,
      null,
      [this.element.attributes],
      pSet
    );
    model.set(pSet);
    model.set(relPset);
  }
}
