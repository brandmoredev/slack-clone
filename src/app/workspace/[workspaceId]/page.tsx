"use client"

import { useGetWorkspaceById } from "@/features/workspaces/api/useGetWorkspaceById"
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId"

const WorkspacePage = () => {
  const workspaceId = useWorkSpaceId()
  const { data } = useGetWorkspaceById({ id: workspaceId })

  return (
    <div>
      <h1>Workspace Page - {JSON.stringify(data)}</h1>
    </div>
  )
}

export default WorkspacePage