import React, {memo, ReactElement, useEffect, useState} from "react";
import {projectBrowserSignal} from "@BimModel/src/Signals";
import {useSignal, useSignalEffect} from "@preact/signals-react";
import StructureItem from "./StructureItem";
import {LevelSystem} from "..";
import {IView} from "../types";
const ModelStructure = ({level}: {level: LevelSystem}) => {
  const [modelStructure, setModelStructure] = useState<ReactElement>(<></>);
  const expanded = useSignal<string[]>([]);

  const updateChildren = (view: IView, visible: boolean) => {
    for (const key in view.children) {
      view.children[key].checked = visible;
      updateChildren(view.children[key], visible);
    }
  };
  const handleCheck = (view: IView) => {
    view.checked = !view.checked;
    updateChildren(view, view.checked);
    view.onActive(view);
    projectBrowserSignal.value = {...projectBrowserSignal.value} as IView;
  };
  const onExpanded = (view: IView) => {
    const newExpanded = new Set(expanded.value);
    if (!newExpanded.has(view.uuid)) {
      newExpanded.add(view.uuid);
    } else {
      newExpanded.delete(view.uuid);
    }
    expanded.value = Array.from(newExpanded);
  };

  useEffect(() => {
    const views = level.getDefaultView();
    projectBrowserSignal.value = views;
    const ex = [views.uuid];
    Object.keys(views.children).forEach((key) => {
      ex.push(key);
    });
    expanded.value = ex;
  }, []);
  useSignalEffect(() => {
    setModelStructure(
      projectBrowserSignal.value ? (
        <StructureItem
          view={projectBrowserSignal.value}
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
