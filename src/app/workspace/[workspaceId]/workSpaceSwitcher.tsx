"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useGetWorkspaceById } from "@/features/workspaces/api/useGetWorkspaceById"
import { useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces"
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId"
import { DataModel } from "../../../../convex/_generated/dataModel"
import { DocumentByName } from "convex/server"
import { Loader, PlusIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCreateWorkspaceModal } from "@/hooks/useCreateWorkSpaceModal"
export type WorkSpaceDocument = DocumentByName<DataModel, "workspaces">

export const WorkSpaceSwitcher = () => {
  const router = useRouter()
  const { setCreateWorkspaceOpen } = useCreateWorkspaceModal()
  const workspaceId = useWorkSpaceId()
  const { data: workSpaces, isLoading: workSpacesLoading } = useGetWorkspaces();
  const { data: workSpace, isLoading: workSpaceLoading } = useGetWorkspaceById({ id: workspaceId })

  const workSpaceInitial = workSpace?.name?.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild id="sidebar-ws-drp-trigger">
        <Button className="size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800 font-semibold text-xl">
          {workSpaceLoading ? (
            <Loader className="size-5 animate-spin shrink-0"/>
          ) :
            workSpaceInitial
          }
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuItem
          className="cursor-pointer flex-col justify-start items-start capitalize text-md"
          onClick={() => router.replace(`/workspace/${workspaceId}`)}
        >
          <span className="text-md font-semibold">{workSpace?.name}</span>
          <span className="text-xs text-muted-foreground">Active workspace</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          { workSpacesLoading
            ? <Loader className="size-5 animate-spin shrink-0"/>
            : workSpaces?.filter((workspace) => workspace._id !== workspaceId)
            .map((workspace) => (
              <DropdownMenuItem
                key={workspace._id}
                className="cursor-pointer justify-start items-center capitalize text-md"
                onClick={() => router.push(`/workspace/${workspace._id}`)}
              >
                <Button className="size-8 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800 font-semibold text-xl">
                  {workspace.name.charAt(0).toUpperCase()}
                </Button>
                <div>
                  <span className="font-semibold">{workspace.name}</span>
                </div>
              </DropdownMenuItem>
            ))}
          <DropdownMenuItem
            className="text-md"
            onClick={() => setCreateWorkspaceOpen(true)}
          >
            <Button className="size-8 relative overflow-hidden bg-accent hover:bg-accent/80 text-slate-800 font-semibold text-xl">
              <PlusIcon className="text-dark"/>
            </Button>
            <span>Add a workspace</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </ DropdownMenuContent>
    </ DropdownMenu >
  )
}