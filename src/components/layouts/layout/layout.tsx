"use client";

import { useState } from "react";

import { useTheme } from "@/contexts/theme";

import Main from "@/components/layouts/main/main";
import Header from "@/components/layouts/header/header";
import Sidebar from "@/components/layouts/sidebar/sidebar";

import { View } from "./helpers/interfaces";

import "./layout.scss";

export default function Layout() {
  const theme = useTheme();

  const [view, setView] = useState<View>("none");

  return (
    <div className={`jmugen-layout ${theme}`}>
      <header className="jmugen-layout__header">
        <Header view={view} onViewChange={setView} />
      </header>
      <aside className="jmugen-layout__sidebar">
        <Sidebar view={view} />
      </aside>
      <main className="jmugen-layout__main">
        <Main view={view} />
      </main>
    </div>
  );
}
