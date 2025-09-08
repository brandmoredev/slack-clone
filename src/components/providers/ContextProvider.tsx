"use client"

import { createContext, useState } from "react";

interface GlobalContextType {
  createWorkspaceOpen: boolean,
  setCreateWorkspaceOpen: (open: boolean) => void;
  createChannelOpen: boolean,
  setCreateChannelOpen: (open: boolean) => void;
}


export const GlobalContext = createContext<GlobalContextType>({
  createWorkspaceOpen: false,
  setCreateWorkspaceOpen: () => {},
  createChannelOpen: false,
  setCreateChannelOpen: () => {},
});

export const GlobalContextProvider = ({ children } : { children: React.ReactNode }) => {
  // Workspace modal
  const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false);
  const [createChannelOpen, setCreateChannelOpen] = useState(false);

  return (
    <GlobalContext.Provider value={{
      createWorkspaceOpen,
      setCreateWorkspaceOpen,
      createChannelOpen,
      setCreateChannelOpen
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
