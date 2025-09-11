import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"

interface UseCurrentChannelMemberProps {
  channelId: Id<"channels">
}

export const useCurrentChannelMember = ({ channelId }: UseCurrentChannelMemberProps) => {
  const data = useQuery(api.channelMembers.current, { channelId })
  const isLoading = data === undefined

  return { data, isLoading }
}