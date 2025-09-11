import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"

interface UseGetChannelMembersProps {
  channelId: Id<"channels">
}

export const useGetChannelMembers = ({ channelId }: UseGetChannelMembersProps) => {
  const data = useQuery(api.channelMembers.get, { channelId })
  const isLoading = data === undefined

  return { data, isLoading }
}