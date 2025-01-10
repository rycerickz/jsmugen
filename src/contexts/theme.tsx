"use client";

import { createContext, ReactNode, useContext } from "react";

const ThemeContext = createContext({});

interface ThemeProps {
  children: ReactNode;
}

export default function ThemeProvider(props: ThemeProps) {
  const { children } = props;

  return (
    <ThemeContext.Provider value="jmugen-light-theme">
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
