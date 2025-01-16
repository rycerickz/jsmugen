import { Definitions } from "./definitions";
import { Commands } from "./commands";
import { States } from "./states";
import { Sounds } from "./sounds";

export interface Entity {
  definitions: Definitions;
  commands: Commands;
  states: States;
  sounds: Sounds;
}
