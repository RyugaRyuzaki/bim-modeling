import {SimpleBeam, SimpleBeamType} from "./Beam";
import {SimpleColumn, SimpleColumnType} from "./Column";
import {SimpleCurtainWall, SimpleCurtainWallType} from "./CurtainWalls";
import {SimpleFurniture, SimpleFurnitureType} from "./Furniture";
import {SimpleMember, SimpleMemberType} from "./Members";
import {SimpleOpening, SimpleOpeningType} from "./Openings";
import {SimplePlate, SimplePlateType} from "./Plates";
import {SimpleSlab, SimpleSlabType} from "./Slabs";
import {SimpleWall, SimpleWallType} from "./Walls";
import {SimpleWindow, SimpleWindowType} from "./Windows";

export interface IIfcBaseConfig {
  Name: string;
  Description: string;
  ObjectType: string;
}
export type IElement =
  | SimpleCurtainWall
  | SimpleFurniture
  | SimpleMember
  | SimplePlate
  | SimpleOpening
  | SimpleSlab
  | SimpleWall
  | SimpleBeam
  | SimpleColumn
  | SimpleWindow;
export type IElementName =
  | "SimpleCurtainWall"
  | "SimpleFurniture"
  | "SimpleMember"
  | "SimplePlate"
  | "SimpleOpening"
  | "SimpleSlab"
  | "SimpleWall"
  | "SimpleBeam"
  | "SimpleColumn"
  | "SimpleWindow";
export type IElementType =
  | SimpleCurtainWallType
  | SimpleFurnitureType
  | SimpleMemberType
  | SimplePlateType
  | SimpleOpeningType
  | SimpleSlabType
  | SimpleWallType
  | SimpleBeamType
  | SimpleColumnType
  | SimpleWindowType;
export type IElementTypeName =
  | "SimpleCurtainWallType"
  | "SimpleFurnitureType"
  | "SimpleMemberType"
  | "SimplePlateType"
  | "SimpleOpeningType"
  | "SimpleSlabType"
  | "SimpleWallType"
  | "SimpleWindowType"
  | "SimpleColumnType"
  | "SimpleBeamType";
