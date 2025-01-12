import ini from "ini";

import { Commands } from "@/interfaces/commands";

import { STATES_EXTENSION } from "@/constants/extensions";

export async function processCns(file: File): Promise<Commands | undefined> {
  try {
    if (!file.name.endsWith(STATES_EXTENSION)) {
      throw new Error(`The provided file is not a ${STATES_EXTENSION} file.`);
    }

    const content = await file.text();
    const json = await cns2Json(content);

    return {
      file,
      content,
      json,
    };
  } catch (e) {
    console.error(`Error processing the ${STATES_EXTENSION} file:`, e);
    return;
  }
}

export async function cns2Json(
  content: string
): Promise<Record<string, string> | undefined> {
  try {
    return ini.parse(content);
  } catch (e) {
    console.error(`Error converting ${STATES_EXTENSION} to json:`, e);
    return;
  }
}
