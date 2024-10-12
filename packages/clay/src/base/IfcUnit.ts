import {IFC4X3 as IFC} from "web-ifc";
import {Model} from "./model";

export class IfcUnit {
  IfcDimensionalExponents: IFC.IfcDimensionalExponents =
    new IFC.IfcDimensionalExponents(0, 0, 0, 0, 0, 0, 0);
  IfcLengthUnit: IFC.IfcSIUnit = new IFC.IfcSIUnit(
    IFC.IfcUnitEnum.LENGTHUNIT,
    "",
    IFC.IfcSIUnitName.METRE
  );
  IfcAreaUnit: IFC.IfcSIUnit = new IFC.IfcSIUnit(
    IFC.IfcUnitEnum.AREAUNIT,
    "",
    IFC.IfcSIUnitName.SQUARE_METRE
  );
  IfcVolumeUnit: IFC.IfcSIUnit = new IFC.IfcSIUnit(
    IFC.IfcUnitEnum.VOLUMEUNIT,
    "",
    IFC.IfcSIUnitName.CUBIC_METRE
  );
  IfcPlaneAngleUnit: IFC.IfcSIUnit = new IFC.IfcSIUnit(
    IFC.IfcUnitEnum.PLANEANGLEUNIT,
    IFC.IfcSIPrefix.ATTO,
    IFC.IfcSIUnitName.RADIAN
  );
  IfcMassUnit: IFC.IfcSIUnit = new IFC.IfcSIUnit(
    IFC.IfcUnitEnum.MASSUNIT,
    IFC.IfcSIPrefix.KILO,
    IFC.IfcSIUnitName.GRAM
  );
  IfcTimeUnit: IFC.IfcSIUnit = new IFC.IfcSIUnit(
    IFC.IfcUnitEnum.TIMEUNIT,
    IFC.IfcSIPrefix.ATTO,
    IFC.IfcSIUnitName.SECOND
  );
  IfcThermoDynamicTemperatureUnit: IFC.IfcSIUnit = new IFC.IfcSIUnit(
    IFC.IfcUnitEnum.THERMODYNAMICTEMPERATUREUNIT,
    IFC.IfcSIPrefix.ATTO,
    IFC.IfcSIUnitName.PASCAL
  );
  IfcLuminousIntensityUnit: IFC.IfcSIUnit = new IFC.IfcSIUnit(
    IFC.IfcUnitEnum.LUMINOUSINTENSITYUNIT,
    IFC.IfcSIPrefix.ATTO,
    IFC.IfcSIUnitName.LUMEN
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
  IfcGeometricRepresentationContext!: IFC.IfcGeometricRepresentationContext;
  IfcGeometricRepresentationSubContext1!: IFC.IfcGeometricRepresentationSubContext;
  IfcGeometricRepresentationSubContext2!: IFC.IfcGeometricRepresentationSubContext;
  IfcGeometricRepresentationSubContext3!: IFC.IfcGeometricRepresentationSubContext;
  IfcGeometricRepresentationSubContext4!: IFC.IfcGeometricRepresentationSubContext;

  /**
   *
   */
  constructor(
    public IfcAxis2PlacementGlobal3D: IFC.IfcAxis2Placement3D,
    public IfcDirectionTrueNorth3D: IFC.IfcDirection
  ) {
    this.IfcGeometricRepresentationContext =
      new IFC.IfcGeometricRepresentationContext(
        new IFC.IfcLabel("Model"),
        new IFC.IfcLabel("0.0"),
        new IFC.IfcDimensionCount(0.0),
        new IFC.IfcReal(1e-3),
        this.IfcAxis2PlacementGlobal3D,
        this.IfcDirectionTrueNorth3D
      );
    this.IfcGeometricRepresentationSubContext1 =
      new IFC.IfcGeometricRepresentationSubContext(
        new IFC.IfcLabel("Axis"),
        new IFC.IfcLabel("Model"),
        this.IfcGeometricRepresentationContext,
        null,
        IFC.IfcGeometricProjectionEnum.GRAPH_VIEW,
        new IFC.IfcLabel("")
      );
    this.IfcGeometricRepresentationSubContext2 =
      new IFC.IfcGeometricRepresentationSubContext(
        new IFC.IfcLabel("Body"),
        new IFC.IfcLabel("Model"),
        this.IfcGeometricRepresentationContext,
        null,

        IFC.IfcGeometricProjectionEnum.MODEL_VIEW,
        new IFC.IfcLabel("")
      );
    this.IfcGeometricRepresentationSubContext3 =
      new IFC.IfcGeometricRepresentationSubContext(
        new IFC.IfcLabel("Box"),
        new IFC.IfcLabel("Model"),
        this.IfcGeometricRepresentationContext,
        null,
        IFC.IfcGeometricProjectionEnum.MODEL_VIEW,
        new IFC.IfcLabel("")
      );
    this.IfcGeometricRepresentationSubContext4 =
      new IFC.IfcGeometricRepresentationSubContext(
        new IFC.IfcLabel("Box"),
        new IFC.IfcLabel("Model"),
        this.IfcGeometricRepresentationContext,
        null,

        IFC.IfcGeometricProjectionEnum.USERDEFINED,
        new IFC.IfcLabel("")
      );
  }
  export(model: Model) {
    model.set(this.IfcAxis2PlacementGlobal3D!);
    model.set(this.IfcDirectionTrueNorth3D!);
    model.set(this.IfcDimensionalExponents);
    model.set(this.IfcLengthUnit);
    model.set(this.IfcAreaUnit);
    model.set(this.IfcVolumeUnit);
    model.set(this.IfcPlaneAngleUnit);
    model.set(this.IfcMassUnit);
    model.set(this.IfcTimeUnit);
    model.set(this.IfcThermoDynamicTemperatureUnit);
    model.set(this.IfcLuminousIntensityUnit);
    model.set(this.IfcMeasureWithUnit);
    model.set(this.IfcConversionBasedUnit);
    model.set(this.IfcUnitAssignment);
    model.set(this.IfcGeometricRepresentationContext);
    model.set(this.IfcGeometricRepresentationSubContext1);
    model.set(this.IfcGeometricRepresentationSubContext2);
    model.set(this.IfcGeometricRepresentationSubContext3);
    model.set(this.IfcGeometricRepresentationSubContext4);
  }
}
