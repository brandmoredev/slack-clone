"use client"

import { useGetWorkspaceById } from "@/features/workspaces/api/useGetWorkspaceById"
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId"

const WorkspacePage = () => {
  const workspaceId = useWorkSpaceId()
  const { data } = useGetWorkspaceById({ id: workspaceId })

  console.log(data)
  
  return (
    <div>
      <h1>Workspace Page - {workspaceId}</h1>
    </div>
  )
}

export default WorkspacePage