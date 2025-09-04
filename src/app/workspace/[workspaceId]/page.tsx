interface WorkSpacePageProps {
  params: {
    workspaceId: string
  }
}

const WorkspacePage = ({ params } : WorkSpacePageProps) => {
  const { workspaceId } = params
  return (
    <div>
      <h1>Workspace Page - {workspaceId}</h1>
    </div>
  )
}

export default WorkspacePage