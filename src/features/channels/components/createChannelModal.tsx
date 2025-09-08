"use client"

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useCreateChannelModal } from "@/hooks/useCreateChannelModal";
import { useState } from "react";
import { ChannelResponseType, useCreateChannel } from "../api/useCreateChannel";
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId";

export const CreateChannelModal = () => {
  const router = useRouter()
  const [name, setName] = useState("")
  const { createChannelOpen, setCreateChannelOpen }= useCreateChannelModal()
  const workspaceId = useWorkSpaceId()

  const { mutate, isPending } = useCreateChannel()

  const handleClose = () => {
    setCreateChannelOpen(false);
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await mutate({ name, workspaceId }, {
        onSuccess: (data: ChannelResponseType) => {
          if (data) {
            toast.success("Workspace created")
            router.push(`/workspace/${workspaceId}/channel/${data._id.toString()}`)
            handleClose()
          }
        },
        onError: () => {
          console.log("Error creating workspace")
        },
        onSettled: () => {
          setName("")
        }
      })
    } catch (error) {
      console.error("Error creating channel:", error)
    }
  }

  return (
    <Dialog open={createChannelOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Channel</DialogTitle>
          <DialogDescription>
            Create a new channel for this workspace.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value.replace(/\s+/g, "-"))}
            disabled={isPending}
            name="Channel Name"
            required
            autoFocus
            minLength={3}
            placeholder="e.g. plan-budget"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}