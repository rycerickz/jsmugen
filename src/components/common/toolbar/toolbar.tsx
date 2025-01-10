"use client";

import { ReactNode } from "react";

import "./toolbar.scss";

interface ToolbarProps {
  children: ReactNode;
}

export default function Toolbar(props: ToolbarProps) {
  const { children } = props;
  return <div className="jmugen-toolbar">{children}</div>;
}
