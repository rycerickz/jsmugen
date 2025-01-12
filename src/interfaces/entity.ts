import { Definitions } from "./definitions";
import { Commands } from "./commands";
import { States } from "./states";

export interface Entity {
  definitions: Definitions;
  commands: Commands;
  states: States;
}
