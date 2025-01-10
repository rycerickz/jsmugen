"use client";

import { Application } from "pixi.js";

import { useEffect, useRef } from "react";

export default function Engine() {
  const engineReference = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialize = async () => {
      const app = new Application();

      await app.init({
        width: 640,
        height: 480,
        backgroundColor: 0x000000,
      });

      if (engineReference.current) {
        engineReference.current.appendChild(app.canvas);
      }
    };

    initialize();
  }, []);

  return <div ref={engineReference} />;
}
