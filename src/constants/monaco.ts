import * as monaco from "monaco-editor";

export const DEFINITIONS_ID = "def";

export const DEFINITIONS_TOKENS: monaco.languages.IMonarchLanguage = {
  tokenizer: {
    root: [
      [/^\s*;.*$/, "comment"],
      [/^(\[.*?\])/, "keyword"],

    
      // Cualquier cosa no reconocida es inválida
      [/.*/, "invalid"],
    ],
  },
};

// export const DEFINITIONS_CONFIGURATION: monaco.languages.LanguageConfiguration =
//   {
//     comments: {
//       lineComment: ";", // En .def (MUGEN), los comentarios comienzan con ;
//     },
//     brackets: [
//       ["{", "}"],
//       ["[", "]"],
//       ["(", ")"],
//     ],
//     autoClosingPairs: [
//       { open: "{", close: "}" },
//       { open: "[", close: "]" },
//       { open: "(", close: ")" },
//       { open: '"', close: '"' },
//       { open: "'", close: "'" },
//     ],
//     surroundingPairs: [
//       { open: "{", close: "}" },
//       { open: "[", close: "]" },
//       { open: "(", close: ")" },
//       { open: '"', close: '"' },
//       { open: "'", close: "'" },
//     ],
//   };

// export const DEFINITIONS_AUTOCOMPLETE: monaco.languages.CompletionItemProvider =
//   {
//     // Por ejemplo: sugerencias de secciones
//     provideCompletionItems(model, position) {
//       const suggestions: monaco.languages.CompletionItem[] = [
//         //   {
//         //     label: "[Info]",
//         //     kind: monaco.languages.CompletionItemKind.Module,
//         //     insertText: "[Info]\n",
//         //     range: undefined,
//         //   },
//         //   {
//         //     label: "[Files]",
//         //     kind: monaco.languages.CompletionItemKind.Module,
//         //     insertText: "[Files]\n",
//         //     range: undefined,
//         //   },
//         //   {
//         //     label: "[Palette Keymap]",
//         //     kind: monaco.languages.CompletionItemKind.Module,
//         //     insertText: "[Palette Keymap]\n",
//         //     range: undefined,
//         //   },
//         //   {
//         //     label: "[Arcade]",
//         //     kind: monaco.languages.CompletionItemKind.Module,
//         //     insertText: "[Arcade]\n",
//         //     range: undefined,
//         //   },
//         // ... lo que necesites
//       ];

//       return { suggestions };
//     },
//   };

export const DEFINITIONS_THEME: monaco.editor.IStandaloneThemeData = {
  base: "vs", // Tema claro
  inherit: true,
  rules: [
    { token: "comment", foreground: "008000", fontStyle: "italic" }, // Verde para comentarios
    { token: "keyword", foreground: "0000FF", fontStyle: "bold" }, // Azul para secciones

 
    { token: "invalid", foreground: "FF0000", fontStyle: "bold" }, // Rojo para inválido
 
  ],
  colors: {
    "editor.background": "#FFFFFF", // Fondo blanco
    "editor.foreground": "#000000", // Texto negro
  },
};
