import ini from "ini";

import { Commands } from "@/interfaces/commands";

import { COMMANDS_EXTENSION } from "@/constants/extensions";

export async function processCmd(file: File): Promise<Commands | undefined> {
  try {
    if (!file.name.endsWith(COMMANDS_EXTENSION)) {
      throw new Error(`The provided file is not a ${COMMANDS_EXTENSION} file.`);
    }

    const content = await file.text();
    const json = await cmd2Json(content);

    return {
      file,
      content,
      json,
    };
  } catch (e) {
    console.error(`Error processing the ${COMMANDS_EXTENSION} file:`, e);
    return;
  }
}

export async function cmd2Json(
  content: string
): Promise<Record<string, string> | undefined> {
  try {
    return ini.parse(content);
  } catch (e) {
    console.error(`Error converting ${COMMANDS_EXTENSION} to json:`, e);
    return;
  }
}
