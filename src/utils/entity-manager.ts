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
    if (!definitions) {
      console.warn("No definitions found.");
      return;
    }

    let commands;
    let states;
    let sounds;

    if (!definitions.json?.Files) {
      console.warn("No files found.");
      return;
    }

    for (const path of Object.values(definitions.json.Files)) {
      const fileName = path.split(/[/\\]/).pop();

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

    if (!commands) {
      console.warn("No commands found.");
      return;
    }

    if (!states) {
      console.warn("No states found.");
      return;
    }

    if (!sounds) {
      console.warn("No sounds found.");
      return;
    }

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
