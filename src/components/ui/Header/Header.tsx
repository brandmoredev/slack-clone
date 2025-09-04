import { useContext } from "react"
import { Button } from "../button"
import UserButton from "@/features/auth/components/userButton"
import { GlobalContext } from "@/components/ContextProvider"

export const Header = () => {
  const { setCreateWorkspaceOpen } = useContext(GlobalContext)

  return (
    <div className="flex justify-end gap-2 p-6">
      <Button variant="outline" onClick={() => setCreateWorkspaceOpen(true)}>CREATE A NEW WORKSPACE</Button>
      <UserButton />
    </div>
  )
}