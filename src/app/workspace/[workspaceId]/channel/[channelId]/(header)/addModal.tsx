import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader, UserPlus } from "lucide-react"
import { CustomTagSuggestion, MemberSelector } from "./memberSelector"
import { useChannelId } from "@/hooks/useChannelId"
import { useGetChannelById } from "@/features/channels/api/useGetChannelById"
import { useState } from "react"
import { DialogDescription } from "@radix-ui/react-dialog"
import { useCurrentChannelMember } from "@/features/channelMembers/api/useCurrentChannelMember"


export const AddModal = () => {
  const [selected, setSelected] = useState<CustomTagSuggestion[]>([])
  const channelId = useChannelId();
  const { data: channel, isLoading: channelLoading } = useGetChannelById({ id: channelId })
  const { data: channelMember, isLoading: channelMemberLoading } = useCurrentChannelMember({ channelId })

  const handleAdd = () => {
    console.log(selected)
  }


  if (channelMemberLoading || channelLoading) {
    return (
      <div className="h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground"/>
      </div>
    )
  }

  if (channelMember?.role !== "admin") {
    return null
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs font-semibold text-accent-foreground"
        >
          <UserPlus />
          <span className="">Invite teammates</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <span className="text-md font-semibold">Add people to #{channel?.name}</span>
          </DialogTitle>
          <DialogDescription>
            Only members of this workspace can be added.
          </DialogDescription>
        </DialogHeader>
        <MemberSelector selected={selected} setSelected={setSelected} type="invite" />
        <Button
          className="w-max ml-auto"
          onClick={handleAdd}
        >
          Add
        </Button>
      </DialogContent>
    </Dialog>
  )
}