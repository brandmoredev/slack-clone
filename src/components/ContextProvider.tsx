"use client"


import { DocumentByName } from "convex/server";
// Update the import path below if your dataModel file is located elsewhere
import type { DataModel } from "../../convex/_generated/dataModel";

import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import { useCurrentUser } from "@/features/auth/api/useCurrentUser";

interface GlobalContextType {
  createWorkspaceOpen: boolean,
  setCreateWorkspaceOpen: (open: boolean) => void;
  user: DocumentByName<DataModel, "users"> | null;
  setUser: Dispatch<SetStateAction<DocumentByName<DataModel, "users"> | null>>;
}


export const GlobalContext = createContext<GlobalContextType>({
  createWorkspaceOpen: false,
  setCreateWorkspaceOpen: () => {},
  user: null,
  setUser: () => {}
});

export const GlobalContextProvider = ({ children } : { children: React.ReactNode }) => {
  const { data } = useCurrentUser() //get current user data from convex
  const [user, setUser] = useState<DocumentByName<DataModel, "users"> | null>(null)
  
  // Workspace modal
  const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false);

  useEffect(() => {
    setUser(data ?? null)
  }, [data])

  return (
    <GlobalContext.Provider value={{ createWorkspaceOpen, setCreateWorkspaceOpen, user, setUser }}>
      {children}
    </GlobalContext.Provider>
  );
};
