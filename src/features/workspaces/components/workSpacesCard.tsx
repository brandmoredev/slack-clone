import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WorkspaceResponseType } from "../api/useCreateWorkspace"
import { Button } from "@/components/ui/button"
import { PiHandWaving } from "react-icons/pi";
import { useRouter } from "next/navigation"
import { useCurrentUser } from "@/features/auth/api/useCurrentUser"


interface WorkSpacesCardProps {
  workspaces: WorkspaceResponseType[]
}


export const WorkSpacesCard = ({ workspaces }: WorkSpacesCardProps) => {
  const router = useRouter();
  const { data } = useCurrentUser()

  const handleClick = (workSpaceId: string | undefined) => {
    router.replace(`/workspace/${workSpaceId}`)
  }

  if (!workspaces) return null;

  if (workspaces?.length > 0) {
    return (
      <div className="flex flex-col space-y-5">
        <h1 className="flex items-center gap-2 text-white text-3xl md:text-5xl font-semibold">
          <PiHandWaving className="text-yellow-500"/> Welcome Back
        </h1>
        <Card className="rounded-sm w-full p-0 gap-0 outline-4 outline-[#FFF3]">
          <CardHeader className="bg-[#ECDEEC] h-20 grid-rows-1">
            <CardTitle className="text-lg font-normal my-auto">Workspaces for { data?.name }</CardTitle>
          </CardHeader>
          {/* <Separator /> */}
          <CardContent className="flex-col p-0">
            { workspaces?.map((workspace) => (
              <div key={workspace?._id} className="w-full py-3 px-6 border-b flex justify-between items-center hover:bg-accent/90">
                <div className="flex">
                  <h3 className="flex-1">{workspace?.name}</h3>
                </div>
                <Button
                  className="p-6 rounded-sm"
                  onClick={() => handleClick(workspace?._id.toString())}
                >
                  LAUNCH SLACK
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
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
