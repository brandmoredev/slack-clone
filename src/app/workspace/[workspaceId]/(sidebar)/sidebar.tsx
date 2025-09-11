import UserButton from "@/features/auth/components/userButton"
import { WorkSpaceSwitcher } from "../workSpaceSwitcher"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { useCreateWorkspaceModal } from "@/hooks/useCreateWorkSpaceModal"
import { SidebarButton } from "./sidebarButton"
import { Home,MessageCircle, Bell, File, Ellipsis } from "lucide-react"
import { Hint } from "@/components/ui/hint"

export const SideBar = () => {
  const { setCreateWorkspaceOpen } = useCreateWorkspaceModal()

  return (
    <aside className="w-[70px] h-full bg-[#4A154B] flex flex-col gap-y-4 items-center py-2">
      <WorkSpaceSwitcher />
      <SidebarButton icon={Home} label="Home" isActive/>
      <SidebarButton icon={MessageCircle} label="DMs" />
      <SidebarButton icon={Bell} label="Activity" />
      <SidebarButton icon={File} label="Files" />
      <SidebarButton icon={Ellipsis} label="More" />

      <div className="flex flex-col items-center justify-center gap-y-3 mt-auto">
        <Hint label="Create New" side="right">
            <Button
              className="w-10 h-10 rounded-4xl overflow-hidden bg-accent/50 hover:bg-accent/40 font-semibold text-xl text-accent"
              onClick={() => setCreateWorkspaceOpen(true)}
            >
              <PlusIcon />
            </Button>
        </Hint>
        <Hint label="User Profile" side="top">
          <div>
            <UserButton />
          </div>
        </Hint>
      </div>
    </aside>
  )
}