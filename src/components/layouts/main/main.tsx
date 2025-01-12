"use client";

import MainDefinitions from "@/components/layouts/main/views/main-definitions/main-definitions";
import MainCommands from "./views/main-commands/main-commands";
import MainStates from "./views/main-states/main-states";

import { View } from "@/types/view";

import { Entity } from "@/interfaces/entity";

import {
  DEFINITIONS_VIEW,
  SPRITES_VIEW,
  ANIMATIONS_VIEW,
  STATES_VIEW,
  COMMANDS_VIEW,
  SOUNDS_VIEW,
} from "@/constants/views";

import "./main.scss";

interface MainProps {
  view: View;
  entity: Entity | undefined;
  onChangeEntity: (entity: Entity) => void;
}

export default function Main(props: MainProps) {
  const { view, entity, onChangeEntity } = props;

  return (
    <div className="jmugen-main">
      {view === DEFINITIONS_VIEW && entity && (
        <MainDefinitions entity={entity} onChangeEntity={onChangeEntity} />
      )}

      {view === STATES_VIEW && entity && (
        <MainStates entity={entity} onChangeEntity={onChangeEntity} />
      )}

      {view === COMMANDS_VIEW && entity && (
        <MainCommands entity={entity} onChangeEntity={onChangeEntity} />
      )}

      {view === SPRITES_VIEW && <p>SFF</p>}
      {view === ANIMATIONS_VIEW && <p>AIR</p>}
      {view === SOUNDS_VIEW && <p>SND</p>}
    </div>
  );
}
