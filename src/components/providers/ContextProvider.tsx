"use client"

import { createContext, useState } from "react";

interface GlobalContextType {
  createWorkspaceOpen: boolean,
  setCreateWorkspaceOpen: (open: boolean) => void;
}


export const GlobalContext = createContext<GlobalContextType>({
  createWorkspaceOpen: false,
  setCreateWorkspaceOpen: () => {},
});

export const GlobalContextProvider = ({ children } : { children: React.ReactNode }) => {
  // Workspace modal
  const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false);

  return (
    <GlobalContext.Provider value={{ createWorkspaceOpen, setCreateWorkspaceOpen }}>
      {children}
    </GlobalContext.Provider>
  );
};
