"use client";

import "./separator.scss";

interface SeparatorProps {
  orientation: "vertical" | "horizontal";
}

export default function Separator(props: SeparatorProps) {
  const { orientation } = props;
  return <div className={`jmugen-separator jmugen-separator--${orientation}`} />;
}
