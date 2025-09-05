import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useGetWorkspaceById } from "@/features/workspaces/api/useGetWorkspaceById"
import { useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces"
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId"
import { DataModel } from "../../../../convex/_generated/dataModel"
import { DocumentByName } from "convex/server"

export type WorkSpaceDocument = DocumentByName<DataModel, "workspaces">

export const WorkSpaceSwitcher = () => {
  const workspaceId = useWorkSpaceId()
  const { data: workspaces } = useGetWorkspaces();
  const { data } = useGetWorkspaceById({ id: workspaceId })

  const workSpaceInitial = data?.name?.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800 font-semibold text-xl">
          {workSpaceInitial}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>{data?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          { workspaces?.filter((workspace) => workspace._id !== workspaceId)
            .map((workspace) => (
              <DropdownMenuItem key={workspace._id}>
                <div>
                  {workspace.name}
                </div>
              </DropdownMenuItem>
            ))}
        </DropdownMenuGroup>
      </ DropdownMenuContent>
    </ DropdownMenu >
  )
}