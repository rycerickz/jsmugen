"use client";

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


import "./sidebar.scss";

interface SidebarProps {
  view: View;
  entity: Entity | undefined;
}

export default function Sidebar(props: SidebarProps) {
  const { view, entity } = props;

  return (
    <div className="jmugen-sidebar">
      {view === DEFINITIONS_VIEW && <p>SFF</p>}
      {view === SPRITES_VIEW && <p>SFF</p>}
      {view === ANIMATIONS_VIEW && <p>AIR</p>}
      {view === STATES_VIEW && <p>CND</p>}
      {view === COMMANDS_VIEW && <p>CMD</p>}
      {view === SOUNDS_VIEW && <p>SND</p>}
    </div>
  );
}
