"use client"

import { Button } from "@/components/ui/button"
import { useCurrentMember } from "@/features/members/api/useCurrentMember"
import { useGetWorkspaceById } from "@/features/workspaces/api/useGetWorkspaceById"
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId"
import { AlertTriangle, Loader, UserPlus } from "lucide-react"
import { WorkspaceHeader } from "./workspaceHeader"

export const WorkspaceSideBar = () => {
  const workspaceId = useWorkSpaceId()
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspaceById({ id: workspaceId })
  const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId })

  if (workspaceLoading || memberLoading) {
    return (
      <div className="bg-[#F9EDFF1C] h-full w-full flex flex-col items-center justify-center">
        <Loader className="size-5 animate-spin text-white"/>
      </div>
    )
  }

  if (!workspace || !member) {
    return (
      <div className="bg-[#F9EDFF1C] h-full w-full flex flex-col items-center justify-center gap-y-2 text-white">
        <AlertTriangle className="text-white text-sm" />
        Workspace not found
      </div>
    )
  }


  return (
    <div className="h-full w-full bg-[#F9EDFF1C] p-2 flex flex-col justify-between items-start relative">
      <WorkspaceHeader workspace={workspace!} isAdmin={member.role === "admin"}/>
      <Button variant="secondary" size="sm" className="w-full h-7 text-xs font-semibold">
        <UserPlus />
        <span className="">Invite teammates</span>
      </Button>
    </div>
  )
}