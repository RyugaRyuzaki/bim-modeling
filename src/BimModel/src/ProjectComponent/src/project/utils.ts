import {IBimElementType} from "../../types";
import {IIfcBuildingStoreyConfig, IIfcProjectConfig} from "./types";
import {
  IIfcBaseConfig,
  Model,
  SimpleCurtainWallType,
  SimpleFurnitureType,
  SimpleMemberType,
  SimpleOpeningType,
  SimplePlateType,
  SimpleSlabType,
  SimpleWallType,
  SimpleWindowType,
  IElementType,
  IElementTypeName,
  SimpleBeamType,
  SimpleColumnType,
  RectangleProfile,
} from "clay";

export const defaultCurtainWallTypes: IIfcBaseConfig[] = [
  {
    Name: "Basic Current Wall",
    Description: "Basic Frame 2x2",
    ObjectType: "Frame 2x2",
  },
];

export const defaultSimpleFurnitureTypes: IIfcBaseConfig[] = [
  {
    Name: "Basic Table",
    Description: "Small Table",
    ObjectType: "Table 1",
  },
  {
    Name: "Basic Chair",
    Description: "Small Chair",
    ObjectType: "Chair 1",
  },
];
export const defaultOpeningTypes: IIfcBaseConfig[] = [
  {
    Name: "",
    Description: "",
    ObjectType: "",
  },
];
export const defaultSimpleSlabTypes: IIfcBaseConfig[] = [
  {
    Name: "",
    Description: "",
    ObjectType: "",
  },
];
export const defaultWallTypes: IIfcBaseConfig[] = [
  {
    Name: "Basic W100",
    Description: "Brick Wall",
    ObjectType: "W100",
  },
  {
    Name: "Basic W200",
    Description: "Brick Wall",
    ObjectType: "W200",
  },
  {
    Name: "Basic W300",
    Description: "Brick Wall",
    ObjectType: "W300",
  },
];
export const defaultWindowTypes: IIfcBaseConfig[] = [
  {
    Name: "1000x200",
    Description: "Brick Window",
    ObjectType: "W100",
  },
];
export const defaultBeamTypes: IIfcBaseConfig[] = [
  {
    Name: "R200x300",
    Description: "Concrete B20",
    ObjectType: "Concrete B20 R200x300",
  },
  {
    Name: "R200x400",
    Description: "Concrete B20",
    ObjectType: "Concrete B20 R200x400",
  },
];
export const defaultColumnTypes: IIfcBaseConfig[] = [
  {
    Name: "R200x300",
    Description: "Concrete B20",
    ObjectType: "Concrete B20 R200x300",
  },
  {
    Name: "R200x400",
    Description: "Concrete B20",
    ObjectType: "Concrete B20 R200x400",
  },
];

export function getDefaultTypes(
  model: Model
): Record<IElementTypeName, IBimElementType<IElementType>> {
  const curtainWalls = defaultCurtainWallTypes.map(
    (d) => new SimpleCurtainWallType(model, d)
  );
  const furnitureTypes = defaultSimpleFurnitureTypes.map(
    (d) => new SimpleFurnitureType(model, d)
  );
  const members: SimpleMemberType[] = [new SimpleMemberType(model)];
  const plates: SimplePlateType[] = [new SimplePlateType(model)];
  const openings: SimpleOpeningType[] = defaultOpeningTypes.map(
    (d) => new SimpleOpeningType(model, d)
  );
  const slabs: SimpleSlabType[] = defaultSimpleSlabTypes.map(
    (d) => new SimpleSlabType(model, d)
  );
  const walls: SimpleWallType[] = defaultWallTypes.map((d, index) => {
    const wType = new SimpleWallType(model, d);
    wType.width = (index + 1) * 0.1;
    return wType;
  });
  const windows: SimpleWindowType[] = defaultWindowTypes.map(
    (d) => new SimpleWindowType(model, d)
  );
  const beams: SimpleBeamType[] = defaultBeamTypes.map((d) => {
    const profile = new RectangleProfile(model);
    const beam = new SimpleBeamType(model, d, profile);
    beam.updateProfile();
    return beam;
  });
  const columns: SimpleColumnType[] = defaultBeamTypes.map((d) => {
    const profile = new RectangleProfile(model);
    const column = new SimpleColumnType(model, d, profile);
    column.updateProfile();
    return column;
  });
  return {
    SimpleCurtainWallType: {
      types: curtainWalls,
      selectType: curtainWalls[0],
    },
    SimpleFurnitureType: {
      types: furnitureTypes,
      selectType: furnitureTypes[0],
    },
    SimpleMemberType: {
      types: members,
      selectType: members[0],
    },
    SimplePlateType: {
      types: plates,
      selectType: plates[0],
    },
    SimpleOpeningType: {
      types: openings,
      selectType: openings[0],
    },
    SimpleSlabType: {
      types: slabs,
      selectType: slabs[0],
    },
    SimpleWallType: {
      types: walls,
      selectType: walls[0],
    },
    SimpleWindowType: {
      types: windows,
      selectType: windows[0],
    },
    SimpleBeamType: {
      types: beams,
      selectType: beams[0],
    },
    SimpleColumnType: {
      types: columns,
      selectType: columns[0],
    },
  } as Record<IElementTypeName, IBimElementType<IElementType>>;
}

export const defaultProjectConfig: IIfcProjectConfig = {
  Name: "Bim-modeling",
  Description: "https://github.com/RyugaRyuzaki/bim-modeling",
  ObjectType: "Bim-modeling",
  Phase: "Concept modeling",
};
export const defaultLevelConfig: IIfcBuildingStoreyConfig[] = [
  {
    Name: "Level 1",
    ObjectType: "Level Circle:Level 1",
    Description: "",
    Elevation: 0.0,
  },
  {
    Name: "Level 2",
    ObjectType: "Level Circle:Level 2",
    Description: "",
    Elevation: 4.0,
  },
];
