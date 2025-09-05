import UserButton from "@/features/auth/components/userButton"
import { WorkSpaceSwitcher } from "./workSpaceSwitcher"

export const SideBar = () => {
  return (
    <aside className="w-[70px] h-full bg-[#4A154B] flex flex-col gap-y-4 items-center pt-4 pb-2">
      <div>
        <WorkSpaceSwitcher />
      </div>
      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </aside>
  )
}