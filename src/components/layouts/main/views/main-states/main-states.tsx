"use client";

import Editor from "@monaco-editor/react";

import { useEntity } from "@/contexts/entity";

import "./main-states.scss";

export default function MainStates() {
  const { entity, setEntity } = useEntity();

  return (
    <Editor
      defaultLanguage="ini"
      defaultValue={entity?.states.content ?? ""}
      onChange={(value: string | undefined) => {
        if (entity) {
          entity.states.content = value;
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
