"use client";

import Button from "@/components/common/button/button";
import Toolbar from "@/components/common/toolbar/toolbar";
import Separator from "@/components/common/separator/separator";

import { View } from "../layout/helpers/interfaces";

import "./header.scss";

interface HeaderProps {
  view: View;
  onViewChange: (view: View) => void;
}

export default function Header(props: HeaderProps) {
  const { view, onViewChange } = props;

  return (
    <div className="jmugen-header">
      <Toolbar>
        <Button type="toolbar" iconLeft="isax isax-folder" onClick={() => {}} />
        <Button
          type="toolbar"
          iconLeft="isax isax-folder-minus"
          onClick={() => {}}
        />
      </Toolbar>

      <Separator orientation="vertical" />

      <Toolbar>
        <Button
          type="toolbar"
          iconLeft="isax isax-document-text"
          active={view === "def"}
          onClick={() => onViewChange("def")}
        />
        <Button
          type="toolbar"
          iconLeft="isax isax-image"
          active={view === "sff"}
          onClick={() => onViewChange("sff")}
        />
        <Button
          type="toolbar"
          iconLeft="isax isax-video-square"
          active={view === "air"}
          onClick={() => onViewChange("air")}
        />
      </Toolbar>
    </div>
  );
}
