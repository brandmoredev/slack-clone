import { GlobalContext } from "@/components/providers/ContextProvider"
import { useContext } from "react"

export const useCreateChannelModal = () => {
  const { createChannelOpen, setCreateChannelOpen } = useContext(GlobalContext)
  return { createChannelOpen, setCreateChannelOpen }
}