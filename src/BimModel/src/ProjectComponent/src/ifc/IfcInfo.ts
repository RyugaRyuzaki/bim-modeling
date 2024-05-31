import {IFC4X3 as IFC} from "web-ifc";
const version = "0.0.1";
const application = "Web application Bim-modeling";
export const IfcActorRole: IFC.IfcActorRole = new IFC.IfcActorRole(
  IFC.IfcRoleEnum.STRUCTURALENGINEER,
  new IFC.IfcLabel(""),
  new IFC.IfcText("")
);
export const IfcAddress = new IFC.IfcAddress(
  IFC.IfcAddressTypeEnum.HOME,
  new IFC.IfcText(""),
  new IFC.IfcLabel("")
);
export const IfcOrganization = new IFC.IfcOrganization(
  new IFC.IfcIdentifier(""),
  new IFC.IfcLabel("@ryuga"),
  new IFC.IfcText(""),
  [IfcActorRole],
  [IfcAddress]
);
export const IfcPerson = new IFC.IfcPerson(
  new IFC.IfcIdentifier("Structure Modeler"),
  new IFC.IfcLabel("Ryuga"),
  new IFC.IfcLabel("Ryuzaki"),
  [new IFC.IfcLabel("")],
  [new IFC.IfcLabel("")],
  [new IFC.IfcLabel("")],
  [IfcActorRole],
  [IfcAddress]
);
export const IfcPersonAndOrganization = new IFC.IfcPersonAndOrganization(
  IfcPerson,
  IfcOrganization,
  [IfcActorRole]
);
export const IfcApplication = new IFC.IfcApplication(
  IfcOrganization,
  new IFC.IfcLabel(version),
  new IFC.IfcLabel(application),
  new IFC.IfcIdentifier("")
);
export const IfcOwnerHistory = new IFC.IfcOwnerHistory(
  IfcPersonAndOrganization,
  IfcApplication,
  IFC.IfcStateEnum.READWRITE,
  IFC.IfcChangeActionEnum.MODIFIED,
  new IFC.IfcTimeStamp(Date.now()),
  IfcPersonAndOrganization,
  IfcApplication,
  new IFC.IfcTimeStamp(Date.now())
);
export const IfcCartesianPointGlobal2D: IFC.IfcCartesianPoint =
  new IFC.IfcCartesianPoint([
    new IFC.IfcLengthMeasure(0),
    new IFC.IfcLengthMeasure(0),
  ]);
export const IfcCartesianPointLocal2D: IFC.IfcCartesianPoint = {
  ...IfcCartesianPointGlobal2D,
};
export const IfcCartesianPointGlobal3D = new IFC.IfcCartesianPoint([
  new IFC.IfcLengthMeasure(0),
  new IFC.IfcLengthMeasure(0),
]);
export const IfcCartesianPointLocal3D: IFC.IfcCartesianPoint = {
  ...IfcCartesianPointGlobal3D,
};
export const IfcDirectionGlobal2D: IFC.IfcDirection = new IFC.IfcDirection([
  new IFC.IfcReal(1.0),
  new IFC.IfcReal(0.0),
]);
export const IfcDirectionLocal2D: IFC.IfcDirection = {...IfcDirectionGlobal2D};
export const IfcDirectionGlobal3D: IFC.IfcDirection = new IFC.IfcDirection([
  new IFC.IfcReal(0.0),
  new IFC.IfcReal(1.0),
  new IFC.IfcReal(0.0),
]);
export const IfcDirectionLocal3D: IFC.IfcDirection = {...IfcDirectionGlobal3D};
export const IfcDirectionTrueNorth3D: IFC.IfcDirection = {
  ...IfcDirectionGlobal3D,
};
export const IfcAxisXPositive: IFC.IfcDirection = new IFC.IfcDirection([
  new IFC.IfcReal(1.0),
  new IFC.IfcReal(0.0),
  new IFC.IfcReal(0.0),
]);
export const IfcAxisXNegative: IFC.IfcDirection = new IFC.IfcDirection([
  new IFC.IfcReal(-1.0),
  new IFC.IfcReal(0.0),
  new IFC.IfcReal(0.0),
]);
export const IfcAxisYPositive: IFC.IfcDirection = new IFC.IfcDirection([
  new IFC.IfcReal(0.0),
  new IFC.IfcReal(1.0),
  new IFC.IfcReal(0.0),
]);
export const IfcAxisYNegative: IFC.IfcDirection = new IFC.IfcDirection([
  new IFC.IfcReal(0.0),
  new IFC.IfcReal(-1.0),
  new IFC.IfcReal(0.0),
]);
export const IfcAxisZPositive: IFC.IfcDirection = new IFC.IfcDirection([
  new IFC.IfcReal(0.0),
  new IFC.IfcReal(0.0),
  new IFC.IfcReal(1.0),
]);
export const IfcAxisZNegative: IFC.IfcDirection = new IFC.IfcDirection([
  new IFC.IfcReal(0.0),
  new IFC.IfcReal(0.0),
  new IFC.IfcReal(-1.0),
]);
export const IfcAxis2PlacementGlobal3D = new IFC.IfcAxis2Placement3D(
  IfcCartesianPointGlobal3D,
  IfcDirectionGlobal3D,
  IfcDirectionLocal3D
);
export const IfcAxis2PlacementLocal3D = new IFC.IfcAxis2Placement3D(
  IfcCartesianPointGlobal3D,
  IfcDirectionLocal3D,
  IfcDirectionLocal3D
);
export const IfcAxis2PlacementGlobal = new IFC.IfcAxis2Placement3D(
  IfcCartesianPointGlobal3D,
  IfcDirectionGlobal3D,
  IfcDirectionLocal3D
);
export const IfcAxis2PlacementLocal = new IFC.IfcAxis2Placement3D(
  IfcCartesianPointGlobal3D,
  IfcDirectionLocal3D,
  IfcDirectionLocal3D
);
export const IfcBuildingAddress = new IFC.IfcPostalAddress(
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
export const IfcSiteAddress = new IFC.IfcPostalAddress(
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
