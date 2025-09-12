"use client"

import { useGetChannelById } from "@/features/channels/api/useGetChannelById"
import { useChannelId } from "@/hooks/useChannelId"
import { Loader, TriangleAlert } from "lucide-react"
import { Header } from "./(header)/header"
import { useGetCreatorInfo } from "@/features/channels/api/useGetCreatorInfo"
import { useCurrentChannelMember } from "@/features/channelMembers/api/useCurrentChannelMember"
import { ChatInput } from "./chatInput"

const ChannelIdPage = () => {
  const channelId = useChannelId();
  const { data: creator } = useGetCreatorInfo({ id: channelId })
  const { data: channel, isLoading: channelLoading } = useGetChannelById({ id: channelId })
  const { data: channelMember, isLoading: channelMemberLoading } = useCurrentChannelMember({ channelId })

  if (channelLoading || channelMemberLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground"/>
      </div>
    )
  }

  if (!channel || !channelMember) {
    return (
      <div className="h-full flex-1 flex flex-col items-center justify-center gap-y-2">
        <TriangleAlert className="size-6 text-muted-foreground"/>
        <span className="text-muted-foreground">Channel not found</span>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <Header title={channel.name} creator={creator}/>
      <div className="flex-1" />
      <ChatInput placeholder={`Message # ${channel.name}`}/>
    </div>
  )
}

export default ChannelIdPage
