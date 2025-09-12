"use client"

import { Button } from "@/components/ui/button"
import { useCurrentMember } from "@/features/members/api/useCurrentMember"
import { useGetWorkspaceById } from "@/features/workspaces/api/useGetWorkspaceById"
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId"
import { AlertTriangle, Loader, SendHorizonal, UserPlus } from "lucide-react"
import { WorkspaceHeader } from "../workspaceHeader"
import { SidebarItem } from "./sidebarItem"
import { Hash } from "lucide-react"
import { useGetChannels } from "@/features/channels/api/useGetChannels"
import { WorkspaceSection } from "../workspaceSection"
import { useGetMembers } from "@/features/members/api/useGetMembers"
import { UserItem } from "./userItem"
import { useCreateChannelModal } from "@/hooks/useCreateChannelModal"
import { useChannelId } from "@/hooks/useChannelId"


export const WorkspaceSideBar = () => {
  const workspaceId = useWorkSpaceId()
  const channelId = useChannelId()
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspaceById({ id: workspaceId })
  const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId })
  const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId })
  const { data: members, isLoading: membersLoading } = useGetMembers({ workspaceId })

  const { setCreateChannelOpen } = useCreateChannelModal();

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
      <div className="flex-1 flex flex-col justify-start w-full pt-4">
        <SidebarItem label="Drafts & sent" icon={SendHorizonal} id="draft" className="w-50"/>
        


        <WorkspaceSection
          label="Channels"
          onNew={member.role === "admin" ? () => setCreateChannelOpen(true) : undefined }
          hint="Add new channel"
        >
          {channelsLoading &&
            <div className="bg-[#F9EDFF1C] h-full w-full flex flex-col items-center justify-center">
              <Loader className="size-5 animate-spin text-white"/>
            </div>
          }
            {channels?.map((item) => (
              <SidebarItem
                key={item._id}
                label={item.name}
                icon={Hash}
                id={item._id}
                isActive={channelId === item._id}
              />
            ))}
        </WorkspaceSection>
        <WorkspaceSection label="Members" onNew={() => {}} hint="Invite new member">
          {membersLoading &&
            <div className="bg-[#F9EDFF1C] h-full w-full flex flex-col items-center justify-center">
              <Loader className="size-5 animate-spin text-white"/>
            </div>
          }
            {members?.map((item) => (
              <UserItem
                key={item._id}
                label={item.user.name}
                id={item.userId}
              />
            ))}
        </WorkspaceSection>
      </div>
      <Button variant="secondary" size="sm" className="w-full h-7 text-xs font-semibold">
        <UserPlus />
        <span className="">Invite teammates</span>
      </Button>
    </div>
  )
}