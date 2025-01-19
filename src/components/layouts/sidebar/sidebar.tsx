"use client";

import { useView } from "@/contexts/view";

import SidebarSounds from "@/components/layouts/sidebar/views/sidebar-sounds/sidebar-sounds";

import {
  DEFINITIONS_VIEW,
  SPRITES_VIEW,
  ANIMATIONS_VIEW,
  STATES_VIEW,
  COMMANDS_VIEW,
  SOUNDS_VIEW,
} from "@/constants/views";

import "./sidebar.scss";

export default function Sidebar() {
  const { view } = useView();

  return (
    <div className="jmugen-sidebar">
      {view === DEFINITIONS_VIEW && <p>SFF</p>}
      {view === SPRITES_VIEW && <p>SFF</p>}
      {view === ANIMATIONS_VIEW && <p>AIR</p>}
      {view === STATES_VIEW && <p>CND</p>}
      {view === COMMANDS_VIEW && <p>CMD</p>}
      {view === SOUNDS_VIEW && <SidebarSounds />}
    </div>
  );
}
