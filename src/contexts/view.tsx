"use client";

import { createContext, ReactNode, useContext, useState } from "react";

import { View } from "@/types/view";

import { NONE_VIEW } from "@/constants/views";

const DEFAULT_VIEW = NONE_VIEW;

interface ViewContextState {
  view: View;
  setView: (view: View) => void;
}

const ViewContext = createContext<ViewContextState>({
  view: DEFAULT_VIEW,
  setView: () => {},
});

interface ViewProps {
  children: ReactNode;
}

export default function ViewProvider(props: ViewProps) {
  const { children } = props;

  const [view, setView] = useState<View>(DEFAULT_VIEW);

  return (
    <ViewContext.Provider value={{ view, setView }}>
      {children}
    </ViewContext.Provider>
  );
}

export const useView = () => useContext(ViewContext);
