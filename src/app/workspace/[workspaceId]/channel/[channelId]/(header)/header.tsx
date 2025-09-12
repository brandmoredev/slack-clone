import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogTrigger} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useRemoveChannel } from "@/features/channels/api/useRemoveChannel"
import { useUpdateChannel } from "@/features/channels/api/useUpdateChannel"
import { useCurrentMember } from "@/features/members/api/useCurrentMember"
import { useChannelId } from "@/hooks/useChannelId"
import { useConfirm } from "@/hooks/useConfirm"
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId"
import { LogOut, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useRef } from "react"
import { PiCaretDown } from "react-icons/pi"
import { toast } from "sonner"
import { AddModal } from "./addModal"


interface HeaderProps {
  title: string,
  creator: {
    name: string | undefined
    email: string | undefined
  } | null | undefined
}

export const Header = ({ title, creator }: HeaderProps) => {
  const router = useRouter()
  const channelId = useChannelId()
  const workspaceId = useWorkSpaceId()
  const { mutate: updateChannel, isPending: updateChannelPending } = useUpdateChannel()
  const { mutate: removeChannel, isPending: removeChannelPending } = useRemoveChannel()
  const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId })

  const inputRef = useRef<HTMLInputElement>(null);
  const [ConfirmUpdateDialog, confirmUpdate] = useConfirm(
    `Rename channel # ${title}`,
    "Enter the new workspace name below."
  )
  const [ConfirmDeleteDialog, confirmDelete] = useConfirm(
    `Are you sure you want to delete channel #${title}`,
    "This action is irreversible."
  )

  const isAdmin = useMemo(() => member?.role === "admin", [member?.role])

  const handleDeleteChannel = async () => {
    if (memberLoading || !isAdmin) return

    const update = await confirmDelete()

    if (!update) return

    removeChannel({
      id: channelId,
    }, {
      onSuccess: () => {
        toast.success("Channel has been removed.")
        router.replace(`/workspace/${workspaceId}`)
      },
      onError: () => {
        toast.error("Failed to delete channel")
      }
    })
  }

  const handleUpdateChannel = async () => {
    if (memberLoading || !isAdmin) return

    const ok = await confirmUpdate()

    if (!ok) return

    updateChannel({
      id: channelId,
      name: inputRef.current!.value
    }, {
      onSuccess: () => {
        toast.success("Channel name updated")
      },
      onError: () => {
        toast.error("Failed to update channel")
      }
    })
  }


  return (
    <div className="min-h-[50px] border-b py-2 px-4 overflow-hidden bg-white flex justify-between">
      <ConfirmDeleteDialog />
      <ConfirmUpdateDialog
        renderChildren={() => (
          <Input
            defaultValue={title}
            ref={inputRef}
            onChange={() => inputRef.current && (inputRef.current.value = inputRef.current.value.replace(/\s+/g, "-"))}
            disabled={updateChannelPending}
            name="Channel Name"
            required
            autoFocus
            minLength={3}
            placeholder="e.g. plan-budget"
          />
        )}
      />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="text-lg font-bold"
          >
            <span className="truncate"># {title}</span>
            <PiCaretDown className="size-3 shrink-0"/>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <span className="font-bold text-xl"># {title}</span>
            </DialogTitle>
          </DialogHeader>
          <Card className="flex flex-row justify-between items-center p-4">
            <div className="flex flex-col">
              <span className="font-semibold">Channel Name</span>
              <span># {title}</span>
            </div>
            {isAdmin &&
              <Button
                variant="ghost"
                className="text-sky-600"
                onClick={handleUpdateChannel}
              >
                Edit
              </Button>
            }
          </Card>
          <Card className="flex flex-row justify-between items-center p-4">
            <div className="flex flex-col">
              <span className="font-semibold">Created by</span>
              <span>{creator?.name}</span>
            </div>
          </Card>
          <Button variant="ghost" className="text-red-600 flex justify-start">
            <LogOut />
            Leave channel
          </Button>
          { isAdmin &&
            <Button
              variant="ghost"
              className="text-red-600 flex justify-start"
              disabled={removeChannelPending}
              onClick={handleDeleteChannel}
            >
              <Trash/>
              Delete Channel
            </Button>
          }
        </DialogContent>
      </Dialog>

      <AddModal />
    </div>
  )
}