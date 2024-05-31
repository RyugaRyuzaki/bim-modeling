import {IFC4X3 as IFC} from "web-ifc";
import {IfcAxis2PlacementGlobal3D, IfcDirectionTrueNorth3D} from "./IfcInfo";

export const IfcDimensionalExponents: IFC.IfcDimensionalExponents =
  new IFC.IfcDimensionalExponents(0, 0, 0, 0, 0, 0, 0);
export const IfcLengthUnit: IFC.IfcSIUnit = new IFC.IfcSIUnit(
  IfcDimensionalExponents,
  IFC.IfcUnitEnum.LENGTHUNIT,
  new IFC.IfcSIPrefix(),
  new IFC.IfcSIUnitName()
);
export const IfcAreaUnit: IFC.IfcSIUnit = new IFC.IfcSIUnit(
  IfcDimensionalExponents,
  IFC.IfcUnitEnum.AREAUNIT,
  new IFC.IfcSIPrefix(),
  new IFC.IfcSIUnitName()
);
export const IfcVolumeUnit: IFC.IfcSIUnit = new IFC.IfcSIUnit(
  IfcDimensionalExponents,
  IFC.IfcUnitEnum.VOLUMEUNIT,
  new IFC.IfcSIPrefix(),
  new IFC.IfcSIUnitName()
);
export const IfcPlaneAngleUnit: IFC.IfcSIUnit = new IFC.IfcSIUnit(
  IfcDimensionalExponents,
  IFC.IfcUnitEnum.PLANEANGLEUNIT,
  new IFC.IfcSIPrefix(),
  new IFC.IfcSIUnitName()
);
export const IfcMassUnit: IFC.IfcSIUnit = new IFC.IfcSIUnit(
  IfcDimensionalExponents,
  IFC.IfcUnitEnum.MASSUNIT,
  new IFC.IfcSIPrefix(),
  new IFC.IfcSIUnitName()
);
export const IfcTimeUnit: IFC.IfcSIUnit = new IFC.IfcSIUnit(
  IfcDimensionalExponents,
  IFC.IfcUnitEnum.TIMEUNIT,
  new IFC.IfcSIPrefix(),
  new IFC.IfcSIUnitName()
);
export const IfcThermoDynamicTemperatureUnit: IFC.IfcSIUnit = new IFC.IfcSIUnit(
  IfcDimensionalExponents,
  IFC.IfcUnitEnum.THERMODYNAMICTEMPERATUREUNIT,
  new IFC.IfcSIPrefix(),
  new IFC.IfcSIUnitName()
);
export const IfcLuminousIntensityUnit: IFC.IfcSIUnit = new IFC.IfcSIUnit(
  IfcDimensionalExponents,
  IFC.IfcUnitEnum.LUMINOUSINTENSITYUNIT,
  new IFC.IfcSIPrefix(),
  new IFC.IfcSIUnitName()
);

export const IfcMeasureWithUnit = new IFC.IfcMeasureWithUnit(
  new IFC.IfcPlaneAngleMeasure(0.0174532925199433),
  IfcPlaneAngleUnit
);
export const IfcConversionBasedUnit = new IFC.IfcConversionBasedUnit(
  IfcDimensionalExponents,
  IFC.IfcUnitEnum.RADIOACTIVITYUNIT,
  new IFC.IfcLabel(""),
  IfcMeasureWithUnit
);
export const IfcUnitAssignment = new IFC.IfcUnitAssignment([
  IfcLengthUnit,
  IfcAreaUnit,
  IfcVolumeUnit,
  IfcPlaneAngleUnit,
  IfcMassUnit,
  IfcTimeUnit,
  IfcThermoDynamicTemperatureUnit,
  IfcLuminousIntensityUnit,
]);
export const IfcGeometricRepresentationContext =
  new IFC.IfcGeometricRepresentationContext(
    new IFC.IfcLabel("Model"),
    new IFC.IfcLabel("0.0"),
    new IFC.IfcDimensionCount(0.0),
    new IFC.IfcReal(1e-3),
    IfcAxis2PlacementGlobal3D,
    IfcDirectionTrueNorth3D
  );
export const IfcGeometricRepresentationSubContext1 =
  new IFC.IfcGeometricRepresentationSubContext(
    new IFC.IfcLabel("Axis"),
    new IFC.IfcLabel("Model"),
    IfcAxis2PlacementGlobal3D,
    IfcGeometricRepresentationContext,
    new IFC.IfcPositiveRatioMeasure(1e-3),
    IFC.IfcGeometricProjectionEnum.GRAPH_VIEW,
    new IFC.IfcLabel("")
  );
export const IfcGeometricRepresentationSubContext2 =
  new IFC.IfcGeometricRepresentationSubContext(
    new IFC.IfcLabel("Body"),
    new IFC.IfcLabel("Model"),
    IfcAxis2PlacementGlobal3D,
    IfcGeometricRepresentationContext,
    new IFC.IfcPositiveRatioMeasure(1e-3),
    IFC.IfcGeometricProjectionEnum.MODEL_VIEW,
    new IFC.IfcLabel("")
  );
export const IfcGeometricRepresentationSubContext3 =
  new IFC.IfcGeometricRepresentationSubContext(
    new IFC.IfcLabel("Box"),
    new IFC.IfcLabel("Model"),
    IfcAxis2PlacementGlobal3D,
    IfcGeometricRepresentationContext,
    new IFC.IfcPositiveRatioMeasure(1e-3),
    IFC.IfcGeometricProjectionEnum.MODEL_VIEW,
    new IFC.IfcLabel("")
  );
export const IfcGeometricRepresentationSubContext4 =
  new IFC.IfcGeometricRepresentationSubContext(
    new IFC.IfcLabel("Box"),
    new IFC.IfcLabel("Model"),
    IfcAxis2PlacementGlobal3D,
    IfcGeometricRepresentationContext,
    new IFC.IfcPositiveRatioMeasure(1e-3),
    IFC.IfcGeometricProjectionEnum.USERDEFINED,
    new IFC.IfcLabel("")
  );
