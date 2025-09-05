import { GlobalContext } from "@/components/ContextProvider"
import { useContext } from "react"

export const useActiveWorkSpace = () => {
  const { activeWorkSpace, setActiveWorkSpace } = useContext(GlobalContext)

  return { activeWorkSpace, setActiveWorkSpace }
}