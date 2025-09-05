import { useContext } from "react"
import { GlobalContext } from "@/components/ContextProvider"

//Call useUser in any component to get current user
export const useUser = () => {
  const { user, setUser} = useContext(GlobalContext)

  return { user, setUser }
}