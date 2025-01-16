"use client";

import { useView } from "@/contexts/view";

import MainDefinitions from "@/components/layouts/main/views/main-definitions/main-definitions";
import MainCommands from "@/components/layouts/main/views/main-commands/main-commands";
import MainStates from "@/components/layouts/main/views/main-states/main-states";
import MainSounds from "@/components/layouts/main/views/main-sounds/main-sounds";

import {
  DEFINITIONS_VIEW,
  SPRITES_VIEW,
  ANIMATIONS_VIEW,
  STATES_VIEW,
  COMMANDS_VIEW,
  SOUNDS_VIEW,
} from "@/constants/views";

import "./main.scss";

export default function Main() {
  const { view } = useView();

  return (
    <div className="jmugen-main">
      {view === DEFINITIONS_VIEW && <MainDefinitions />}
      {view === SPRITES_VIEW && <p>SFF</p>}
      {view === ANIMATIONS_VIEW && <p>AIR</p>}
      {view === STATES_VIEW && <MainStates />}
      {view === COMMANDS_VIEW && <MainCommands />}
      {view === SOUNDS_VIEW && <MainSounds />}
    </div>
  );
}
