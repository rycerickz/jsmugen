"use client";

import { View } from "../layout/helpers/interfaces";

import "./sidebar.scss";

interface SidebarProps {
  view: View;
}

export default function Sidebar(props: SidebarProps) {
  const { view } = props;

  return (
    <div className="jmugen-sidebar">
      {view === "def" && <p>DEF</p>}
      {view === "sff" && <p>SFF</p>}
      {view === "air" && <p>AIR</p>}
      {view === "none" && <p>Sidebar</p>}
    </div>
  );
}
