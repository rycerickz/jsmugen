"use client";

import { useMemo } from "react";

import List from "@/components/common/list/list";
import Button from "@/components/common/button/button";
import Toolbar from "@/components/common/toolbar/toolbar";

import { useEntity } from "@/contexts/entity";

import { Option } from "@/interfaces/option";
import { Sound } from "@/interfaces/sounds";

import "./sidebar-sounds.scss";

export default function SidebarSounds() {
  const { entity, setEntity } = useEntity();

  const options: Option<Sound>[] = useMemo(() => {
    return (
      entity?.sounds.decoded.sounds.map((sound: Sound) => ({
        id: sound.id,
        label: sound.index + " - " + sound.group,
        data: sound,
        selected: false,
      })) ?? []
    );
  }, [entity?.sounds.decoded.sounds]);

  return (
    <div className="jmugen-sidebar-sounds">
      <h1 className="jmugen-sidebar-sounds__title">Sounds</h1>
      <Toolbar>
        <Button type="primary" iconLeft="isax isax-play" onClick={() => {}} />
        <Button type="primary" iconLeft="isax isax-pause" onClick={() => {}} />
        <Button type="primary" iconLeft="isax isax-stop" onClick={() => {}} />
      </Toolbar>
      <List
        options={options}
        onSelect={(option) => {
          if (entity && option.data) {
            entity.sounds.selectedSound = option.data;
            setEntity({ ...entity });
          }
        }}
      />
    </div>
  );
}
