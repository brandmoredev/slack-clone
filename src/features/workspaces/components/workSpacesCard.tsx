import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WorkspaceResponseType } from "../api/useCreateWorkspace"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useUser } from "@/features/auth/api/useUser"


interface WorkSpacesCardProps {
  workspaces: WorkspaceResponseType[]
}

export const WorkSpacesCard = ({ workspaces }: WorkSpacesCardProps) => {
  const { user } = useUser();

  if (!workspaces) return null;

  if (workspaces?.length > 0) {
    return (
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>Workspaces for { user?.name }</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          { workspaces?.map((workspace) => (
            <div key={workspace?._id} className="w-full flex justify-between items-center">
              <div className="flex">
                <h3 className="flex-1">{workspace?.name}</h3>
              </div>
              <Button className="p-6 rounded-sm">LAUNCH SLACK</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  } else {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Workspaces Found</CardTitle>
        </CardHeader>
      </Card>
    )
  }

}
