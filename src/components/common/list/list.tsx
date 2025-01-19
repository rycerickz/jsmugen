"use client";

import { Option } from "@/interfaces/option";

import "./list.scss";

interface ListProps<T> {
  options: Option<T>[];
  onSelect: (option: Option<T>, index: number) => void;
}

export default function List<T>(props: ListProps<T>) {
  const { options, onSelect } = props;

  return (
    <ul className="jmugen-list">
      {options.map((option: Option<T>, index: number) => (
        <li
          key={option.id}
          className={`
            jmugen-list__item 
            ${option.selected ? "jmugen-list__item--selected" : ""}
          `}
          onClick={() => onSelect(option, index)}
        >
          {option.label}
        </li>
      ))}
    </ul>
  );
}
