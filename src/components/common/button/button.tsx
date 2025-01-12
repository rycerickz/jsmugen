"use client";

import "./button.scss";

interface ButtonProps {
  type: "primary" | "toolbar";
  label?: string;
  iconLeft?: string;
  iconRight?: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export default function Button(props: ButtonProps) {
  const { type, label, iconLeft, iconRight, active, disabled, onClick } = props;

  return (
    <button
      type="button"
      className={`
        jmugen-button 
        jmugen-button--${type}
        ${active ? `jmugen-button--active` : ""} 
      `}
      disabled={disabled}
      onClick={onClick}
    >
      {iconLeft && <i className={`jmugen-button__icon-left ${iconLeft}`}></i>}

      {label && <span className="jmugen-button__label">{label}</span>}

      {iconRight && (
        <i className={`jmugen-button__icon-right ${iconRight}`}></i>
      )}
    </button>
  );
}
