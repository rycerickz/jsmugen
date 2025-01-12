"use client";

import Editor from "@monaco-editor/react";

import { Entity } from "@/interfaces/entity";

import "./main-commands.scss";

interface MainCommandsProps {
  entity: Entity;
  onChangeEntity: (entity: Entity) => void;
}

export default function MainCommands(props: MainCommandsProps) {
  const { entity, onChangeEntity } = props;

  return (
    <Editor
      defaultLanguage="ini"
      defaultValue={entity.commands.content}
      onChange={(value: string | undefined) => {
        entity.commands.content = value;
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
