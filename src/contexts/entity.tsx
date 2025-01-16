"use client";

import { createContext, ReactNode, useContext, useState } from "react";

import { Entity } from "@/interfaces/entity";

interface EntityContextState {
  entity: Entity | undefined;
  setEntity: (entity: Entity | undefined) => void;
}

const EntityContext = createContext<EntityContextState>({
  entity: undefined,
  setEntity: () => {},
});

interface EntityProps {
  children: ReactNode;
}

export default function EntityProvider(props: EntityProps) {
  const { children } = props;

  const [entity, setEntity] = useState<Entity | undefined>();

  return (
    <EntityContext.Provider value={{ entity, setEntity }}>
      {children}
    </EntityContext.Provider>
  );
}

export const useEntity = () => useContext(EntityContext);
