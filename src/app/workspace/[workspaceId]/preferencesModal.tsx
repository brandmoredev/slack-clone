import { useUpdateWorkspace } from "@/features/workspaces/api/useUpdateWorkspace"
import { useRemoveWorkspace } from "@/features/workspaces/api/useRemoveWorkspace"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Doc } from "../../../../convex/_generated/dataModel"
import { Edit, Trash } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useRouter } from "next/navigation"


interface PreferencesModalProps {
  open: boolean,
  setOpen: (open: boolean) => void,
  workspace: Doc<"workspaces">
}


export const PreferencesModal = ({
  open,
  setOpen,
  workspace
}:PreferencesModalProps) => {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [editValue, setEditValue] = useState(workspace.name)
  const [deleteOpen, setDeleteOpen] = useState(false)
  
  const { mutate: updateWorkspace, isPending: isPendingUpdateWorkspace } = useUpdateWorkspace()
  const { mutate: removeWorkspace, isPending: isPendingRemoveWorkspace } = useRemoveWorkspace()

  const handleUpdateWorkspace = (e: { preventDefault: () => void }) => {
    e.preventDefault()

    updateWorkspace({
      id: workspace._id,
      name: editValue
    }, {
      onSuccess: () => {
        setEditValue("")
        setEditOpen(false)
        toast.success("Workspace Updated")
      },
      onError: () => {
        toast.error("Failed to update workspace")
      }
    })
  }

  const handleDelete = () => {
    removeWorkspace({
      id: workspace._id
    }, {
      onSuccess: () => {
        setDeleteOpen(false)
        toast.info("Workspace has been deleted")
        router.replace("/")
      },
      onError: () => {
        toast.error("Failed to delete workspace")
      }
    })
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 w-[800px] h-max overflow-hidden pb-6">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="font-bold text-2xl">
            Preferences
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="account" orientation="vertical" className="flex flex-row w-full h-full">
          <TabsList className="flex flex-col w-60 h-full bg-accent/20 drop-shadow-none">
            <TabsTrigger value="account" className="w-full justify-start">Workpace Settings</TabsTrigger>
            <TabsTrigger value="password" className="w-full justify-start">Notification</TabsTrigger>
          </TabsList>
          <div className="h-full flex-1 flex flex-col">
            <TabsContent value="account" className="">
              <div>{workspace.name}</div>
              <div className="w-full flex-1 mt-6">
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                  <DialogTrigger asChild>
                    <Button
                      disabled={false}
                      variant="outline"
                      size="sm"
                      onClick={() => {}}
                    >
                      <Edit />
                      Edit workspace
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Rename this workspace
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdateWorkspace}>
                      <Input
                        value={editValue}
                        name="workspaceName"
                        required
                        autoFocus
                        minLength={3}
                        maxLength={30}
                        placeholder="Workspace name (e.g. 'Work', 'Personal', 'Project')"
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                      <DialogFooter className="pt-3">
                        <DialogClose asChild>
                          <Button variant="outline" size="sm" disabled={isPendingUpdateWorkspace}>
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button type="submit" size="sm" className="px-5" disabled={isPendingUpdateWorkspace}>
                          Save
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                  <DialogTrigger asChild>
                    <Button
                      disabled={false}
                      variant="outline"
                      size="sm"
                      className="text-red-500 border-none"
                      onClick={() => {}}
                      >
                      <Trash />
                      Delete workspace
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Are you sure you want to delete {`"${workspace.name}"`}
                      </DialogTitle>
                      <DialogDescription className="text-red-600">
                        Deleting this workspace will delete all contents (i.e. messages, files, etc.)
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-3">
                      <DialogClose asChild>
                        <Button variant="outline" size="sm" disabled={isPendingRemoveWorkspace}>
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button variant="destructive" size="sm" className="px-5" disabled={isPendingRemoveWorkspace}
                        onClick={handleDelete}
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </TabsContent>
            <TabsContent value="password">
              Notification Preferences
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}