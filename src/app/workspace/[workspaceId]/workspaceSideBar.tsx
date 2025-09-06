"use client"

import { Button } from "@/components/ui/button"
import { useGetWorkspaceById } from "@/features/workspaces/api/useGetWorkspaceById"
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId"
import { Edit, Settings, UserPlus } from "lucide-react"
import { PiCaretDown } from "react-icons/pi"

export const WorkspaceSideBar = () => {
  const workspaceId = useWorkSpaceId()
  const { data: workspace } = useGetWorkspaceById({ id: workspaceId })

  return (
    <div className="h-full w-full bg-[#F9EDFF1C] p-2 flex flex-col justify-between items-start relative">
      <div className="w-full flex justify-between items-center">
        <div>
          <Button variant="transparent" className="text-lg font-bold">
            {workspace?.name}
            <PiCaretDown className="size-3"/>
          </Button>
        </div>
        <div className="flex flex-1 justify-end gap-2 text-accent">
          <Button variant="transparent" size="iconSm">
            <Settings className="size-5 text-accent/70"/>
          </Button>
          <Button variant="transparent" size="iconSm">
            <Edit className="size-5 text-accent/70"/>
          </Button>
        </div>
      </div>
      <Button variant="secondary" size="sm" className="w-full h-7 text-xs font-semibold">
        <UserPlus />
        <span className="">Invite teammates</span>
      </Button>
    </div>
  )
}