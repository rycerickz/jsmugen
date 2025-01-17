"use client";

import { useEffect, useMemo, useRef } from "react";

import WaveSurfer from "wavesurfer.js";

import { useEntity } from "@/contexts/entity";

import "./sidebar-sounds.scss";

import List from "@/components/common/list/list";
import { Option } from "@/interfaces/option";
import { Sound } from "@/interfaces/sounds";

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
    <div>
      <p>Sonido</p>
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
