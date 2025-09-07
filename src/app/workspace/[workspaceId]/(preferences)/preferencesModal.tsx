import { useUpdateWorkspace } from "@/features/workspaces/api/useUpdateWorkspace"
import { useRemoveWorkspace } from "@/features/workspaces/api/useRemoveWorkspace"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Doc } from "../../../../../convex/_generated/dataModel"
import { Edit, Trash } from "lucide-react"
import { useRef } from "react"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useConfirm } from "@/hooks/useConfirm"


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

  const [ConfirmDeleteDialog, confirmDelete] = useConfirm(
    "Are you sure you want to delete this workspace?",
    "This action is irreversible"
  )

  const inputRef = useRef<HTMLInputElement>(null);
  const [ConfirmUpdateDialog, confirmUpdate] = useConfirm(
    `Rename this workspace - ${workspace.name}` ,
    "Enter the new name below"
  )
  
  const { mutate: updateWorkspace } = useUpdateWorkspace()
  const { mutate: removeWorkspace } = useRemoveWorkspace()

  const handleUpdateWorkspace = async () => {
    const ok = await confirmUpdate()

    if (!ok) return 

    updateWorkspace({
      id: workspace._id,
      name: inputRef.current!.value.trim()
    }, {
      onSuccess: () => {
        toast.success("Workspace Updated")
      },
      onError: () => {
        toast.error("Failed to update workspace")
      }
    })
  }

  const handleDeleteWorkspace = async () => {
    const ok = await confirmDelete()

    if (!ok) return

    removeWorkspace({
      id: workspace._id
    }, {
      onSuccess: () => {
        toast.info("Workspace has been deleted")
        router.replace("/")
      },
      onError: () => {
        toast.error("Failed to delete workspace")
      }
    })
  }


  return (
    <>
      <ConfirmDeleteDialog />
      <ConfirmUpdateDialog 
        renderChildren={() => (
          <Input
            defaultValue={workspace.name}
            name="workspaceName"
            ref={inputRef}
            required
            autoFocus
            minLength={3}
            maxLength={30}
            placeholder="Workspace name (e.g. 'Work', 'Personal', 'Project')"
          />
        )}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 w-[800px] h-max overflow-hidden pb-6">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="font-bold text-2xl">
              Preferences
            </DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="account" orientation="vertical" className="flex flex-row h-full">
            <TabsList className="flex flex-col max-w-60 h-full bg-accent/20 drop-shadow-none">
              <TabsTrigger value="account" className="w-full justify-start">Workpace Settings</TabsTrigger>
              <TabsTrigger value="password" className="w-full justify-start">Notification</TabsTrigger>
            </TabsList>
            <div className="h-full flex-1 flex flex-col p-4">
              <TabsContent value="account" className="">
                <div className="flex justify-between">
                  <div>{workspace.name}</div>
                  <Button
                    disabled={false}
                    variant="outline"
                    size="sm"
                    onClick={handleUpdateWorkspace}
                  >
                    <Edit />
                    Edit workspace
                  </Button>
                </div>
                <div className="w-full flex justify-start items-end mt-6">
                    <Button
                      disabled={false}
                      variant="outline"
                      size="sm"
                      className="text-red-500 border-none w-full flex justify-start"
                      onClick={handleDeleteWorkspace}
                      >
                      <Trash />
                      Delete workspace
                    </Button>
                </div>
              </TabsContent>
              <TabsContent value="password">
                Notification Preferences
              </TabsContent>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}