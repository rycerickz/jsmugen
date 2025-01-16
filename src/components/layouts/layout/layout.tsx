"use client";

import { useTheme } from "@/contexts/theme";

import Main from "@/components/layouts/main/main";
import Header from "@/components/layouts/header/header";
import Sidebar from "@/components/layouts/sidebar/sidebar";

import "./layout.scss";

export default function Layout() {
  const { theme } = useTheme();

  return (
    <div className={`jmugen-layout ${theme}`}>
      <header className="jmugen-layout__header">
        <Header />
      </header>
      <aside className="jmugen-layout__sidebar">
        <Sidebar />
      </aside>
      <main className="jmugen-layout__main">
        <Main />
      </main>
    </div>
  );
}
