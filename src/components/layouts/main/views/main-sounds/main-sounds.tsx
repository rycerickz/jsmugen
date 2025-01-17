"use client";

import { useEffect, useRef } from "react";

import WaveSurfer from "wavesurfer.js";

import { useEntity } from "@/contexts/entity";

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

  const playAudio = () => {
    wavesurferInstance.current?.play();
  };

  const pauseAudio = () => {
    wavesurferInstance.current?.pause();
  };

  const stopAudio = () => {
    wavesurferInstance.current?.stop();
  };

  return (
    <div className="jmugen-main-sounds">
      <div className="jmugen-main-sounds__waveform">
        <div ref={wavesurferReference} />
      </div>
      <div className="controls">
        <button onClick={playAudio}>Play</button>
        <button onClick={pauseAudio}>Pause</button>
        <button onClick={stopAudio}>Stop</button>
      </div>
    </div>
  );
}
