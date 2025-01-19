"use client";

import { useEffect, useRef } from "react";

import WaveSurfer from "wavesurfer.js";

import { useEntity } from "@/contexts/entity";

import sidebarEmitter$ from "@/events/sidebar-emitter";

import "./main-sounds.scss";

export default function MainSounds() {
  const { entity } = useEntity();

  const wavesurferReference = useRef<HTMLDivElement | null>(null);
  const wavesurferInstance = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (wavesurferReference.current && entity?.sounds.selectedSound?.blob) {
      wavesurferInstance.current = WaveSurfer.create({
        container: wavesurferReference.current,
      });

      wavesurferInstance.current.loadBlob(entity.sounds.selectedSound.blob);
    }

    return () => {
      if (wavesurferInstance.current) {
        wavesurferInstance.current.destroy();
      }
    };
  }, [entity, entity?.sounds.selectedSound?.blob]);

  useEffect(() => {
    const onPlay = () => {
      wavesurferInstance.current?.play();
    };

    const onPause = () => {
      wavesurferInstance.current?.pause();
    };

    const onStop = () => {
      wavesurferInstance.current?.stop();
    };

    const onSelectSound = (index: number) => {};

    sidebarEmitter$.on("play", onPlay);
    sidebarEmitter$.on("pause", onPause);
    sidebarEmitter$.on("stop", onStop);
    sidebarEmitter$.on("select-sound", onSelectSound);

    return () => {
      sidebarEmitter$.off("play", onPlay);
      sidebarEmitter$.off("pause", onPause);
      sidebarEmitter$.off("stop", onStop);
      sidebarEmitter$.off("select-sound", onSelectSound);
    };
  }, []);

  return (
    <div className="jmugen-main-sounds">
      <div className="jmugen-main-sounds__waveform">
        <div ref={wavesurferReference} />
      </div>
    </div>
  );
}
