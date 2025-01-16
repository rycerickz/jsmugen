"use client";

import Editor from "@monaco-editor/react";

import { useEntity } from "@/contexts/entity";

import "./main-commands.scss";

export default function MainCommands() {
  const { entity, setEntity } = useEntity();

  return (
    <Editor
      defaultLanguage="ini"
      defaultValue={entity?.commands.content ?? ""}
      onChange={(value: string | undefined) => {
        if (entity) {
          entity.commands.content = value;
          setEntity({ ...entity });
        }
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
