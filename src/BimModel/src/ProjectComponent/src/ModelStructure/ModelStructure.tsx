import React, {memo, ReactElement, useEffect, useState} from "react";
import * as THREE from "three";
import {ModelingTools} from "@BimModel/src/ModelingComponent";
import {ProjectComponent} from "@BimModel/src/ProjectComponent";
import {IStructure} from "@BimModel/src/ProjectComponent/types";
import {modelStructureSignal} from "@BimModel/src/Signals";
import {useSignal, useSignalEffect} from "@preact/signals-react";
import StructureItem from "./StructureItem";
const defaultUuid = THREE.MathUtils.generateUUID();
const ModelStructure = ({project}: {project: ProjectComponent}) => {
  const [modelStructure, setModelStructure] = useState<ReactElement>(<></>);
  const expanded = useSignal<string[]>([defaultUuid]);
  const getDefaultStructure = (): IStructure => {
    const modelStructure: IStructure = {
      name: project.modelStructure,
      uuid: defaultUuid,
      visible: true,
      children: {},
      onVisibility: project.onVisibility,
    };
    const childrenModelStructure = modelStructure.children;
    for (const tool of ModelingTools) {
      const {discipline, types} = tool;
      if (discipline === "Modify") continue;
      if (!childrenModelStructure[discipline]) {
        const uuid = THREE.MathUtils.generateUUID();
        childrenModelStructure[discipline] = {
          name: discipline,
          uuid: uuid,
          visible: true,
          children: {},
          onVisibility: project.onVisibility,
        } as IStructure;
        expanded.value = [...expanded.value, uuid];
      }
      const children = childrenModelStructure[discipline].children;
      for (const {type} of types) {
        if (!children[type])
          children[type] = {
            name: type,
            uuid: THREE.MathUtils.generateUUID(),
            visible: true,
            children: {},
            onVisibility: project.onVisibility,
          } as IStructure;
      }
    }
    return modelStructure;
  };
  const updateChildren = (structure: IStructure, visible) => {
    for (const key in structure.children) {
      structure.children[key].visible = visible;
      updateChildren(structure.children[key], visible);
    }
  };
  const handleCheck = (structure: IStructure) => {
    structure.visible = !structure.visible;
    updateChildren(structure, structure.visible);
    structure.onVisibility(structure.visible, structure);
    modelStructureSignal.value = {...modelStructureSignal.value} as IStructure;
  };
  const onExpanded = (structure: IStructure) => {
    const newExpanded = new Set(expanded.value);
    if (!newExpanded.has(structure.uuid)) {
      newExpanded.add(structure.uuid);
    } else {
      newExpanded.delete(structure.uuid);
    }
    expanded.value = Array.from(newExpanded);
  };

  useEffect(() => {
    modelStructureSignal.value = getDefaultStructure();
  }, []);
  useSignalEffect(() => {
    setModelStructure(
      modelStructureSignal.value ? (
        <StructureItem
          structure={modelStructureSignal.value}
          expanded={expanded.value}
          onExpanded={onExpanded}
          handleCheck={handleCheck}
        />
      ) : (
        <></>
      )
    );
  });
  return <>{modelStructure}</>;
};

export default memo(ModelStructure);
