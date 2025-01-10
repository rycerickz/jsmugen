"use client";

import { View } from "../layout/helpers/interfaces";

import "./main.scss";

interface MainProps {
  view: View;
}

export default function Main(props: MainProps) {
  const { view } = props;

  return (
    <div className="jmugen-main">
      {view === "def" && <p>DEF</p>}
      {view === "sff" && <p>SFF</p>}
      {view === "air" && <p>AIR</p>}
      {view === "none" && <p>Main</p>}
    </div>
  );
}
