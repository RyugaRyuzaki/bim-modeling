import {IIfcBaseConfig} from "clay";

export interface IIfcBuildingStoreyConfig extends IIfcBaseConfig {
  Elevation: number;
}
export interface IIfcBuildingConfig extends IIfcBaseConfig {
  ElevationOfRefHeight: number;
  ElevationOfTerrain: number;
}
export interface IIfcSiteConfig extends IIfcBaseConfig {
  RefLatitude: number[];
  RefLongitude: number[];
  RefElevation: number;
}
export interface IIfcProjectConfig extends IIfcBaseConfig {
  Phase: string;
}
