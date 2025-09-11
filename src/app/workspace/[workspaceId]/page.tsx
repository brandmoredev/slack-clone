"use client"

import { useGetChannels } from "@/features/channels/api/useGetChannels"
import { useCurrentMember } from "@/features/members/api/useCurrentMember"
import { useGetWorkspaceById } from "@/features/workspaces/api/useGetWorkspaceById"
import { useCreateChannelModal } from "@/hooks/useCreateChannelModal"
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId"
import { Loader, TriangleAlert } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"

const WorkspacePage = () => {
  const router = useRouter()
  const workspaceId = useWorkSpaceId()
  const { data: member, isLoading: memberLoading }  = useCurrentMember({ workspaceId })
  const { createChannelOpen, setCreateChannelOpen } = useCreateChannelModal();

  const { data: workspace, isLoading: workspaceLoading} = useGetWorkspaceById({ id: workspaceId })
  const { data: channels, isLoading: channelsLoading} = useGetChannels({ workspaceId });

  const channelId = useMemo(() => channels?.[0]?._id, [channels])
  const isAdmin = useMemo(() => member?.role === "admin", [member?.role])

  useEffect(() => {
    if (workspaceLoading || channelsLoading || !workspace || memberLoading || !member) return;

    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`)
    } else if (!createChannelOpen && isAdmin) {
      setCreateChannelOpen(true)
    }
  }, [
    channelId,
    workspace,
    workspaceLoading,
    channelsLoading,
    router,
    workspaceId,
    createChannelOpen,
    setCreateChannelOpen,
    isAdmin,
    member,
    memberLoading
  ])

  if (workspaceLoading || channelsLoading || memberLoading) {
    return (
      <div className="h-full flex-1 flex justify-center items-center gap-2">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!workspace || !member) {
    return (
      <div className="h-full flex-1 flex justify-center items-center gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span>Workspace not found!</span>
      </div>
    )
  }

  if (!channelId) {
    return (
      <div className="h-full flex-1 flex justify-center items-center gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span>No channel found!</span>
      </div>
    )
  }

  return null;
}

export default WorkspacePage