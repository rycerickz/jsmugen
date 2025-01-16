"use client";

import { useEffect } from "react";

import Editor, { useMonaco } from "@monaco-editor/react";

import { useEntity } from "@/contexts/entity";

import {
  DEFINITIONS_ID,
  DEFINITIONS_TOKENS,
  // DEFINITIONS_CONFIGURATION,
  // DEFINITIONS_AUTOCOMPLETE,
  DEFINITIONS_THEME,
} from "@/constants/monaco";

import "./main-definitions.scss";

export default function MainDefinitions() {
  const { entity, setEntity } = useEntity();

  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.languages.register({ id: DEFINITIONS_ID });
      monaco.languages.setMonarchTokensProvider(
        DEFINITIONS_ID,
        DEFINITIONS_TOKENS
      );
      // monaco.languages.setLanguageConfiguration(
      //   DEFINITIONS_ID,
      //   DEFINITIONS_CONFIGURATION
      // );
      // monaco.languages.registerCompletionItemProvider(
      //   DEFINITIONS_ID,
      //   DEFINITIONS_AUTOCOMPLETE
      // );
      monaco.editor.defineTheme(DEFINITIONS_ID, DEFINITIONS_THEME);
    }
  }, [monaco]);

  return (
    <Editor
      defaultLanguage={DEFINITIONS_ID}
      defaultValue={entity?.definitions.content ?? ""}
      onChange={(value: string | undefined) => {
        if (entity) {
          entity.definitions.content = value ?? "";
          setEntity({ ...entity });
        }
      }}
      theme={DEFINITIONS_ID}
      options={{
        fontSize: 12,
        wordWrap: "on",
        scrollBeyondLastLine: false,
        minimap: { enabled: true },
      }}
    />
  );
}
