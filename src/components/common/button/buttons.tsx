"use client";

import { ReactNode } from "react";

import "./buttons.scss";

interface ButtonsProps {
  type: "right";
  children: ReactNode;
}

export default function Buttons(props: ButtonsProps) {
  const { children, type } = props;
  return (
    <div className={`jmugen-buttons jmugen-buttons--${type}`}>{children}</div>
  );
}
