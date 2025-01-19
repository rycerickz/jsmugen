"use client";

import { MouseEvent, useState, useRef, useCallback, useEffect } from "react";

import { Option } from "@/interfaces/option";

import "./selector-slider.scss";

interface SelectorSliderProps<T> {
  index: number;
  options: Option<T>[];
  onSelect: (option: Option<T>, index: number) => void;
}

export default function SelectorSlider<T>(props: SelectorSliderProps<T>) {
  const { index, options, onSelect } = props;

  const sliderReference = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState(index);
  const [isDragging, setIsDragging] = useState(false);

  const calculate = useCallback(
    (clientX: number) => {
      const slider = sliderReference.current;
      if (!slider) return position;

      const { left, width } = slider.getBoundingClientRect();
      const relativeX = Math.max(0, Math.min(clientX - left, width));

      return Math.floor((relativeX / width) * options.length);
    },
    [position, options.length]
  );

  const update = useCallback(
    (index: number) => {
      const clamped = Math.min(Math.max(index, 0), options.length - 1);
      if (clamped !== position) {
        setPosition(clamped);
        onSelect(options[clamped], clamped);
      }
    },
    [position, options, onSelect]
  );

  const onMouseDown = useCallback(() => setIsDragging(true), []);

  const onMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (isDragging) {
        const index = calculate(event.clientX);
        update(index);
      }
    },
    [isDragging, calculate, update]
  );

  const onMouseUp = useCallback(() => setIsDragging(false), []);

  const onMouseLeave = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (index >= 0 && index < options.length) {
      setPosition(index);
    }
  }, [index, options.length]);

  return (
    <div
      ref={sliderReference}
      className="jmugen-selector-slider"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      <div className="jmugen-selector-slider__track">
        <div
          className="jmugen-selector-slider__thumb"
          style={{ left: `${(position / (options.length - 1)) * 100}%` }}
        />
      </div>
      <div className="jmugen-selector-slider__label">
        {position + 1} / {options.length}
      </div>
    </div>
  );
}
