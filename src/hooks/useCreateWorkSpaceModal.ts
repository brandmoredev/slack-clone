import { GlobalContext } from "@/components/ContextProvider"
import { useContext } from "react"

export const useCreateWorkspaceModal = () => {
  const { createWorkspaceOpen, setCreateWorkspaceOpen } = useContext(GlobalContext)
  return { createWorkspaceOpen, setCreateWorkspaceOpen }
}