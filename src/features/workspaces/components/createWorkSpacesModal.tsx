"use client"

import { GlobalContext } from "@/components/providers/ContextProvider";
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
import { useContext, useState } from "react";
import { useCreateWorkspace, WorkspaceResponseType } from "../api/useCreateWorkspace";
import { useRouter } from "next/navigation";

export const CreateWorkSpaceModal = () => {
  const router = useRouter()
  const [name, setName] = useState("")
  const { createWorkspaceOpen, setCreateWorkspaceOpen } = useContext(GlobalContext)

  const { mutate, isPending } = useCreateWorkspace()

  const handleClose = () => {
    setCreateWorkspaceOpen(false);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await mutate({ name }, {
        onSuccess: (data: WorkspaceResponseType) => {
          if (data) {
            toast.success("Workspace created")
            router.push(`/workspace/${data._id.toString()}`)
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
      console.error("Error creating workspace:", error)
    }
  }

  return (
    <Dialog open={createWorkspaceOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>
            Create a new workspace for your project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            name="workspaceName"
            required
            autoFocus
            minLength={3}
            placeholder="Workspace Name (e.g. 'Work', 'Personal')"
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