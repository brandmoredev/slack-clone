"use client"


import { DocumentByName } from "convex/server";
// Update the import path below if your dataModel file is located elsewhere
import type { DataModel } from "../../convex/_generated/dataModel";

import { createContext, useState } from "react";

interface GlobalContextType {
 createWorkspaceOpen: boolean,
 setCreateWorkspaceOpen: (open: boolean) => void;
 user: DocumentByName<DataModel, "users"> | null;
}


export const GlobalContext = createContext<GlobalContextType>({
  createWorkspaceOpen: false,
  setCreateWorkspaceOpen: () => {},
  user: null,
});

export const GlobalContextProvider = ({ children } : { children: React.ReactNode }) => {
  
  // Workspace modal
  const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false);
  const [user, setUser] = useState(null)

  return (
    <GlobalContext.Provider value={{ createWorkspaceOpen, setCreateWorkspaceOpen, user }}>
      {children}
    </GlobalContext.Provider>
  );
};