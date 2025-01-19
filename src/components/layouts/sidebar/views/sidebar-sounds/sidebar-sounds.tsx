"use client";

import { useCallback, useMemo, useState } from "react";

import Button from "@/components/common/button/button";
import Toolbar from "@/components/common/toolbar/toolbar";
import SelectorSlider from "@/components/common/selector-slider/selector-slider";

import { useEntity } from "@/contexts/entity";

import { Sound } from "@/interfaces/sounds";
import { Option } from "@/interfaces/option";

import sidebarEmitter$ from "@/events/sidebar-emitter";

import "./sidebar-sounds.scss";

export default function SidebarSounds() {
  const { entity, setEntity } = useEntity();

  const [index, setIndex] = useState(0);

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

  const onSelectSound = useCallback(
    (index: number) => {
      if (!entity || index < 0 || index >= options.length) return;

      sidebarEmitter$.onSelectSound(index);

      setIndex(index);
      setEntity({
        ...entity,
        sounds: {
          ...entity.sounds,
          selectedSound: options[index].data,
        },
      });
    },
    [entity, setEntity, options]
  );

  const onNext = useCallback(() => {
    onSelectSound(index + 1);
  }, [onSelectSound, index]);

  const onPrevious = useCallback(() => {
    onSelectSound(index - 1);
  }, [onSelectSound, index]);

  const onPlay = useCallback(() => {
    sidebarEmitter$.onPlay();
  }, []);

  const onPause = useCallback(() => {
    sidebarEmitter$.onPause();
  }, []);

  const onStop = useCallback(() => {
    sidebarEmitter$.onStop();
  }, []);

  if (!entity) return <></>;

  return (
    <div className="jmugen-sidebar-sounds">
      <h1 className="jmugen-sidebar-sounds__title">Sounds</h1>

      <Toolbar>
        <Button type="primary" iconLeft="isax isax-play" onClick={onPlay} />
        <Button type="primary" iconLeft="isax isax-pause" onClick={onPause} />
        <Button type="primary" iconLeft="isax isax-stop" onClick={onStop} />
        <Button
          type="primary"
          iconLeft="isax isax-arrow-left"
          disabled={index === 0}
          onClick={onPrevious}
        />
        <Button
          type="primary"
          iconLeft="isax isax-arrow-right"
          disabled={index === options.length - 1}
          onClick={onNext}
        />
      </Toolbar>

      <SelectorSlider
        index={index}
        options={options}
        onSelect={(_: Option<Sound>, index: number) => {
          onSelectSound(index);
        }}
      />
    </div>
  );
}
