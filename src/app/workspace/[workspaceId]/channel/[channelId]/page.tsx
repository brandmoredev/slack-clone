"use client"

import { useGetChannelById } from "@/features/channels/api/useGetChannelById"
import { useChannelId } from "@/hooks/useChannelId"
import { Loader, TriangleAlert } from "lucide-react"
import { Header } from "./header"
import { useGetCreatorInfo } from "@/features/channels/api/useGetCreatorInfo"

const ChannelIdPage = () => {
  const channelId = useChannelId();
  const { data: creator } = useGetCreatorInfo({ id: channelId })
  const { data: channel, isLoading: channelLoading } = useGetChannelById({ id: channelId })

  if (channelLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground"/>
      </div>
    )
  }

  if (!channel) {
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
    </div>
  )
}

export default ChannelIdPage
