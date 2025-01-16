import { processDef } from "./files/def";
import { processCmd } from "./files/cmd";
import { processCns } from "./files/cns";
import { processSnd } from "./files/snd";

import { Entity } from "@/interfaces/entity";

import {
  STATES_EXTENSION,
  COMMANDS_EXTENSION,
  SOUNDS_EXTENSION,
} from "@/constants/extensions";

export async function processEntity(
  file: File,
  files: File[]
): Promise<Entity | undefined> {
  try {
    const definitions = await processDef(file);
    if (!definitions) return;

    let commands;
    let states;
    let sounds;

    if (!definitions.json?.Files) return;
    for (const fileName of Object.values(definitions.json.Files)) {
      const file = files.find((f) => f.name === fileName);
      if (!file) continue;

      if (file.name.endsWith(STATES_EXTENSION)) {
        states = await processCns(file);
      }

      if (file.name.endsWith(COMMANDS_EXTENSION)) {
        commands = await processCmd(file);
      }

      if (file.name.endsWith(SOUNDS_EXTENSION)) {
        sounds = await processSnd(file);
      }
    }

    if (!commands) return;
    if (!states) return;
    if (!sounds) return;

    return {
      definitions,
      commands,
      states,
      sounds,
    };
  } catch (e) {
    console.error("Error processing entity:", e);
    return;
  }
}
