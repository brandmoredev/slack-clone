import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"


import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import { useState } from "react"
import { Copy, RefreshCcw } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId"
import { useNewJoinCode } from "@/features/workspaces/api/useNewJoinCode"


type InviteMembersModalProps = {
  joinCode: string;
  name: string;
  open: boolean;
  setOpen: (open: boolean) => void
}

export const InviteMembersModal = ({ joinCode, name, open, setOpen }: InviteMembersModalProps) => {
  const [emails, setEmails] = useState("")
  const [loading, setLoading] = useState(false)

  const workspaceId = useWorkSpaceId();

  const { mutate, isPending } = useNewJoinCode()

  // const parseEmails = (input: string): string[] => {
  //   return input
  //     .split(/[\n,]+/)
  //     .map((email) => email.trim())
  //     .filter((email) => email.length > 0)
  // }

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()

  //   setLoading(true)

  //   try {
  //     // TODO: Replace with actual invite API
  //     await new Promise((resolve) => setTimeout(resolve, 1000))
  //     toast.success(`Invited ${parsed.length} member(s).`)
  //     setOpen(false)
  //     setEmails("")
  //   } catch (error) {
  //     toast.error("Failed to send invites.")
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const handleCopy = async () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`
    await navigator.clipboard.writeText(inviteLink)
    toast.success("Invite copied to clipboard!")
  }

  const handleNewCode = async () => {
    await mutate({ workspaceId }, {
      onSuccess: () => {
        toast.success("Invite code regenerated")
      },
      onError: () => {
        toast.error("Failed to regenerate invite code")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Invite people to {name}</DialogTitle>
          <DialogDescription>
            Send invites or share the join code below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={() => {}} className="space-y-4">
          <div className="grid gap-2">
            <Textarea
              id="emails"
              value={emails}
              disabled={loading}
              onChange={(e) => setEmails(e.target.value)}
              placeholder={`example1@email.com,\nexample2@email.com`}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Invites"}
            </Button>
          </DialogFooter>
        </form>

        <Separator className="my-4" />

        <div className="flex flex-col items-center justify center gap-2">
          <p>OR SHARE THE JOIN CODE BELOW</p>
          <p className="text-5xl font-bold tracking-widest uppercase">
            {joinCode}
          </p>
          <Button
            disabled={isPending}
            type="button"
            variant="ghost"
            className="text-sky-600"
            onClick={handleNewCode}
          >
            Newcode
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="text-sky-600"
            onClick={handleCopy}
          >
            Copy link
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
