import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"

interface UseGetCreatorInfoProps {
  id: Id<"channels">
}

export const useGetCreatorInfo = ({ id }: UseGetCreatorInfoProps) => {
  const data =  useQuery(api.channels.getCreatorInfoByChannelId, { id })

  const isLoading = data === undefined

  return { data, isLoading }
}