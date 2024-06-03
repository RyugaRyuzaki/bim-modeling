import {IFC4X3 as IFC} from "web-ifc";
import {IfcUnit} from "./IfcUnit";
const version = "0.0.1";
const application = "Web application Bim-modeling";
export class IfcInfo {
  IfcActorRole: IFC.IfcActorRole = new IFC.IfcActorRole(
    IFC.IfcRoleEnum.STRUCTURALENGINEER,
    new IFC.IfcLabel(""),
    new IFC.IfcText("")
  );
  IfcAddress = new IFC.IfcAddress(
    IFC.IfcAddressTypeEnum.HOME,
    new IFC.IfcText(""),
    new IFC.IfcLabel("")
  );
  IfcOrganization = new IFC.IfcOrganization(
    new IFC.IfcIdentifier(""),
    new IFC.IfcLabel("@ryuga"),
    new IFC.IfcText(""),
    [this.IfcActorRole],
    [this.IfcAddress]
  );
  IfcPerson = new IFC.IfcPerson(
    new IFC.IfcIdentifier("Structure Modeler"),
    new IFC.IfcLabel("Ryuga"),
    new IFC.IfcLabel("Ryuzaki"),
    [new IFC.IfcLabel("")],
    [new IFC.IfcLabel("")],
    [new IFC.IfcLabel("")],
    [this.IfcActorRole],
    [this.IfcAddress]
  );
  IfcPersonAndOrganization = new IFC.IfcPersonAndOrganization(
    this.IfcPerson,
    this.IfcOrganization,
    [this.IfcActorRole]
  );
  IfcApplication = new IFC.IfcApplication(
    this.IfcOrganization,
    new IFC.IfcLabel(version),
    new IFC.IfcLabel(application),
    new IFC.IfcIdentifier("")
  );
  IfcOwnerHistory = new IFC.IfcOwnerHistory(
    this.IfcPersonAndOrganization,
    this.IfcApplication,
    IFC.IfcStateEnum.READWRITE,
    IFC.IfcChangeActionEnum.MODIFIED,
    new IFC.IfcTimeStamp(Date.now()),
    this.IfcPersonAndOrganization,
    this.IfcApplication,
    new IFC.IfcTimeStamp(Date.now())
  );
  IfcCartesianPointGlobal2D: IFC.IfcCartesianPoint = new IFC.IfcCartesianPoint([
    new IFC.IfcLengthMeasure(0),
    new IFC.IfcLengthMeasure(0),
  ]);

  IfcCartesianPointGlobal3D = new IFC.IfcCartesianPoint([
    new IFC.IfcLengthMeasure(0),
    new IFC.IfcLengthMeasure(0),
  ]);

  IfcDirectionGlobal2D: IFC.IfcDirection = new IFC.IfcDirection([
    new IFC.IfcReal(1.0),
    new IFC.IfcReal(0.0),
  ]);
  IfcDirectionGlobal3D: IFC.IfcDirection = new IFC.IfcDirection([
    new IFC.IfcReal(0.0),
    new IFC.IfcReal(1.0),
    new IFC.IfcReal(0.0),
  ]);
  IfcDirectionLocal3D: IFC.IfcDirection = {...this.IfcDirectionGlobal3D};
  IfcDirectionTrueNorth3D: IFC.IfcDirection = {
    ...this.IfcDirectionGlobal3D,
  };
  IfcAxisXPositive: IFC.IfcDirection = new IFC.IfcDirection([
    new IFC.IfcReal(1.0),
    new IFC.IfcReal(0.0),
    new IFC.IfcReal(0.0),
  ]);
  IfcAxisXNegative: IFC.IfcDirection = new IFC.IfcDirection([
    new IFC.IfcReal(-1.0),
    new IFC.IfcReal(0.0),
    new IFC.IfcReal(0.0),
  ]);
  IfcAxisYPositive: IFC.IfcDirection = new IFC.IfcDirection([
    new IFC.IfcReal(0.0),
    new IFC.IfcReal(1.0),
    new IFC.IfcReal(0.0),
  ]);
  IfcAxisYNegative: IFC.IfcDirection = new IFC.IfcDirection([
    new IFC.IfcReal(0.0),
    new IFC.IfcReal(-1.0),
    new IFC.IfcReal(0.0),
  ]);
  IfcAxisZPositive: IFC.IfcDirection = new IFC.IfcDirection([
    new IFC.IfcReal(0.0),
    new IFC.IfcReal(0.0),
    new IFC.IfcReal(1.0),
  ]);
  IfcAxisZNegative: IFC.IfcDirection = new IFC.IfcDirection([
    new IFC.IfcReal(0.0),
    new IFC.IfcReal(0.0),
    new IFC.IfcReal(-1.0),
  ]);
  IfcAxis2PlacementGlobal3D = new IFC.IfcAxis2Placement3D(
    this.IfcCartesianPointGlobal3D,
    this.IfcDirectionGlobal3D,
    this.IfcDirectionLocal3D
  );

  IfcAxis2PlacementGlobal = new IFC.IfcAxis2Placement3D(
    this.IfcCartesianPointGlobal3D,
    this.IfcDirectionGlobal3D,
    this.IfcDirectionLocal3D
  );

  IfcBuildingAddress = new IFC.IfcPostalAddress(
    IFC.IfcAddressTypeEnum.OFFICE,
    new IFC.IfcText(""),
    new IFC.IfcLabel(""),
    new IFC.IfcLabel(""),
    [new IFC.IfcLabel("")],
    new IFC.IfcLabel(""),
    new IFC.IfcLabel(""),
    new IFC.IfcLabel(""),
    new IFC.IfcLabel(""),
    new IFC.IfcLabel("")
  );
  IfcSiteAddress = new IFC.IfcPostalAddress(
    IFC.IfcAddressTypeEnum.SITE,
    new IFC.IfcText(""),
    new IFC.IfcLabel(""),
    new IFC.IfcLabel(""),
    [new IFC.IfcLabel("")],
    new IFC.IfcLabel(""),
    new IFC.IfcLabel(""),
    new IFC.IfcLabel(""),
    new IFC.IfcLabel(""),
    new IFC.IfcLabel("")
  );
  ifcUnit = new IfcUnit(
    this.IfcAxis2PlacementGlobal3D,
    this.IfcDirectionTrueNorth3D
  );
}
