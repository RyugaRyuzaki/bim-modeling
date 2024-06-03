import {IFC4X3 as IFC} from "web-ifc";

export class IfcUnit {
  private IfcAxis2PlacementGlobal3D!: IFC.IfcAxis2Placement3D;
  private IfcDirectionTrueNorth3D!: IFC.IfcDirection;
  IfcDimensionalExponents: IFC.IfcDimensionalExponents =
    new IFC.IfcDimensionalExponents(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
  IfcLengthUnit: IFC.IfcSIUnit = new IFC.IfcSIUnit(
    this.IfcDimensionalExponents,
    IFC.IfcUnitEnum.LENGTHUNIT,
    IFC.IfcSIPrefix,
    IFC.IfcSIUnitName
  );
  IfcAreaUnit: IFC.IfcSIUnit = new IFC.IfcSIUnit(
    this.IfcDimensionalExponents,
    IFC.IfcUnitEnum.AREAUNIT,
    IFC.IfcSIPrefix,
    IFC.IfcSIUnitName
  );
  IfcVolumeUnit: IFC.IfcSIUnit = new IFC.IfcSIUnit(
    this.IfcDimensionalExponents,
    IFC.IfcUnitEnum.VOLUMEUNIT,
    IFC.IfcSIPrefix,
    IFC.IfcSIUnitName
  );
  IfcPlaneAngleUnit: IFC.IfcSIUnit = new IFC.IfcSIUnit(
    this.IfcDimensionalExponents,
    IFC.IfcUnitEnum.PLANEANGLEUNIT,
    new IFC.IfcSIPrefix(),
    new IFC.IfcSIUnitName()
  );
  IfcMassUnit: IFC.IfcSIUnit = new IFC.IfcSIUnit(
    this.IfcDimensionalExponents,
    IFC.IfcUnitEnum.MASSUNIT,
    new IFC.IfcSIPrefix(),
    new IFC.IfcSIUnitName()
  );
  IfcTimeUnit: IFC.IfcSIUnit = new IFC.IfcSIUnit(
    this.IfcDimensionalExponents,
    IFC.IfcUnitEnum.TIMEUNIT,
    new IFC.IfcSIPrefix(),
    new IFC.IfcSIUnitName()
  );
  IfcThermoDynamicTemperatureUnit: IFC.IfcSIUnit = new IFC.IfcSIUnit(
    this.IfcDimensionalExponents,
    IFC.IfcUnitEnum.THERMODYNAMICTEMPERATUREUNIT,
    new IFC.IfcSIPrefix(),
    new IFC.IfcSIUnitName()
  );
  IfcLuminousIntensityUnit: IFC.IfcSIUnit = new IFC.IfcSIUnit(
    this.IfcDimensionalExponents,
    IFC.IfcUnitEnum.LUMINOUSINTENSITYUNIT,
    new IFC.IfcSIPrefix(),
    new IFC.IfcSIUnitName()
  );

  IfcMeasureWithUnit = new IFC.IfcMeasureWithUnit(
    new IFC.IfcPlaneAngleMeasure(0.0174532925199433),
    this.IfcPlaneAngleUnit
  );
  IfcConversionBasedUnit = new IFC.IfcConversionBasedUnit(
    this.IfcDimensionalExponents,
    IFC.IfcUnitEnum.RADIOACTIVITYUNIT,
    new IFC.IfcLabel(""),
    this.IfcMeasureWithUnit
  );
  IfcUnitAssignment = new IFC.IfcUnitAssignment([
    this.IfcLengthUnit,
    this.IfcAreaUnit,
    this.IfcVolumeUnit,
    this.IfcPlaneAngleUnit,
    this.IfcMassUnit,
    this.IfcTimeUnit,
    this.IfcThermoDynamicTemperatureUnit,
    this.IfcLuminousIntensityUnit,
  ]);
  IfcGeometricRepresentationContext = new IFC.IfcGeometricRepresentationContext(
    new IFC.IfcLabel("Model"),
    new IFC.IfcLabel("0.0"),
    new IFC.IfcDimensionCount(0.0),
    new IFC.IfcReal(1e-3),
    this.IfcAxis2PlacementGlobal3D,
    this.IfcDirectionTrueNorth3D
  );
  IfcGeometricRepresentationSubContext1 =
    new IFC.IfcGeometricRepresentationSubContext(
      new IFC.IfcLabel("Axis"),
      new IFC.IfcLabel("Model"),
      this.IfcAxis2PlacementGlobal3D,
      this.IfcGeometricRepresentationContext,
      new IFC.IfcPositiveRatioMeasure(1e-3),
      IFC.IfcGeometricProjectionEnum.GRAPH_VIEW,
      new IFC.IfcLabel("")
    );
  IfcGeometricRepresentationSubContext2 =
    new IFC.IfcGeometricRepresentationSubContext(
      new IFC.IfcLabel("Body"),
      new IFC.IfcLabel("Model"),
      this.IfcAxis2PlacementGlobal3D,
      this.IfcGeometricRepresentationContext,
      new IFC.IfcPositiveRatioMeasure(1e-3),
      IFC.IfcGeometricProjectionEnum.MODEL_VIEW,
      new IFC.IfcLabel("")
    );
  IfcGeometricRepresentationSubContext3 =
    new IFC.IfcGeometricRepresentationSubContext(
      new IFC.IfcLabel("Box"),
      new IFC.IfcLabel("Model"),
      this.IfcAxis2PlacementGlobal3D,
      this.IfcGeometricRepresentationContext,
      new IFC.IfcPositiveRatioMeasure(1e-3),
      IFC.IfcGeometricProjectionEnum.MODEL_VIEW,
      new IFC.IfcLabel("")
    );
  IfcGeometricRepresentationSubContext4 =
    new IFC.IfcGeometricRepresentationSubContext(
      new IFC.IfcLabel("Box"),
      new IFC.IfcLabel("Model"),
      this.IfcAxis2PlacementGlobal3D,
      this.IfcGeometricRepresentationContext,
      new IFC.IfcPositiveRatioMeasure(1e-3),
      IFC.IfcGeometricProjectionEnum.USERDEFINED,
      new IFC.IfcLabel("")
    );

  /**
   *
   */
  constructor(
    IfcAxis2PlacementGlobal3D: IFC.IfcAxis2Placement3D,
    IfcDirectionTrueNorth3D: IFC.IfcDirection
  ) {
    this.IfcAxis2PlacementGlobal3D = IfcAxis2PlacementGlobal3D;
    this.IfcDirectionTrueNorth3D = IfcDirectionTrueNorth3D;
  }
}
