"use client";

import { createContext, ReactNode, useContext, useState } from "react";

const DEFAULT_THEME = "jmugen-light-theme";

interface ThemeContextState {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextState>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
});

interface ThemeProps {
  children: ReactNode;
}

export default function ThemeProvider(props: ThemeProps) {
  const { children } = props;

  const [theme, setTheme] = useState(DEFAULT_THEME);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
