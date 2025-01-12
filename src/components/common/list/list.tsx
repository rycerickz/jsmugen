"use client";

import { Option } from "@/interfaces/option";

import "./list.scss";

interface ListProps<T> {
  options: Option<T>[];
  onSelect: (option: Option<T>) => void;
}

export default function List<T>(props: ListProps<T>) {
  const { options, onSelect } = props;

  return (
    <ul className="jmugen-list">
      {options.map((option: Option<T>) => (
        <li
          key={option.id}
          className={`
            jmugen-list__item 
            ${option.selected ? "jmugen-list__item--selected" : ""}
          `}
          onClick={() => onSelect(option)}
        >
          {option.label}
        </li>
      ))}
    </ul>
  );
}
