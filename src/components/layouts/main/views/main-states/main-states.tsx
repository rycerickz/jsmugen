"use client";

import Editor from "@monaco-editor/react";

import { Entity } from "@/interfaces/entity";

import "./main-states.scss";

interface MainStatesProps {
  entity: Entity;
  onChangeEntity: (entity: Entity) => void;
}

export default function MainStates(props: MainStatesProps) {
  const { entity, onChangeEntity } = props;

  return (
    <Editor
      defaultLanguage="ini"
      defaultValue={entity.states.content}
      onChange={(value: string | undefined) => {
        entity.states.content = value;
        onChangeEntity({ ...entity });
      }}
      theme="vs-light"
      options={{
        fontSize: 12,
        wordWrap: "on",
        scrollBeyondLastLine: false,
        minimap: { enabled: true },
      }}
    />
  );
}
