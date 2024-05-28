import React, {memo, ReactElement, useEffect, useState} from "react";
import * as THREE from "three";
import {ModelingTools} from "@BimModel/src/ModelingComponent";
import {StructureComponent} from "../..";
import {IStructure} from "../../types";
import {modelStructureSignal} from "@BimModel/src/Signals";
import {useSignal, useSignalEffect} from "@preact/signals-react";
import StructureItem from "./StructureItem";
const defaultUuid = THREE.MathUtils.generateUUID();
const ModelStructure = ({structure}: {structure: StructureComponent}) => {
  const [modelStructure, setModelStructure] = useState<ReactElement>(<></>);
  const expanded = useSignal<string[]>([defaultUuid]);
  const getDefaultStructure = (): IStructure => {
    const modelStructure: IStructure = {
      name: structure.modelStructure,
      uuid: defaultUuid,
      visible: true,
      children: {},
      onVisibility: structure.onVisibility,
    };
    const childrenModelStructure = modelStructure.children;
    for (const tool of ModelingTools) {
      const {discipline, types} = tool;
      if (discipline === "Modify") continue;
      if (!childrenModelStructure[discipline])
        childrenModelStructure[discipline] = {
          name: discipline,
          uuid: THREE.MathUtils.generateUUID(),
          visible: true,
          children: {},
          onVisibility: structure.onVisibility,
        } as IStructure;
      const children = childrenModelStructure[discipline].children;
      for (const {type} of types) {
        if (!children[type])
          children[type] = {
            name: type,
            uuid: THREE.MathUtils.generateUUID(),
            visible: true,
            children: {},
            onVisibility: structure.onVisibility,
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
