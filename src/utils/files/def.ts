import ini from "ini";

import { Definitions } from "@/interfaces/definitions";

import { DEFINITIONS_EXTENSION } from "@/constants/extensions";

export async function processDef(file: File): Promise<Definitions | undefined> {
  try {
    if (!file.name.endsWith(DEFINITIONS_EXTENSION)) {
      throw new Error(
        `The provided file is not a ${DEFINITIONS_EXTENSION} file.`
      );
    }

    const content = await file.text();
    const json = await def2Json(content);

    return {
      file,
      content,
      json,
    };
  } catch (e) {
    console.error(`Error processing the ${DEFINITIONS_EXTENSION} file:`, e);
    return;
  }
}

export async function def2Json(
  content: string
): Promise<Record<string, string> | undefined> {
  try {
    return ini.parse(content);
  } catch (e) {
    console.error(`Error converting ${DEFINITIONS_EXTENSION} to json:`, e);
    return;
  }
}
