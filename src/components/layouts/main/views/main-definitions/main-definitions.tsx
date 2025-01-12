"use client";

import Editor from "@monaco-editor/react";

import { Entity } from "@/interfaces/entity";

import "./main-definitions.scss";

interface MainDefinitionsProps {
  entity: Entity;
  onChangeEntity: (entity: Entity) => void;
}

export default function MainDefinitions(props: MainDefinitionsProps) {
  const { entity, onChangeEntity } = props;

  return (
    <Editor
      defaultLanguage="ini"
      defaultValue={entity.definitions.content}
      onChange={(value: string | undefined) => {
        entity.definitions.content = value;
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
