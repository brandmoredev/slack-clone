import { Button } from "@/components/ui/button"
import { useGetWorkspaceById } from "@/features/workspaces/api/useGetWorkspaceById"
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId"
import { ArrowLeft, ArrowRight, Clock3, Info, Search } from "lucide-react"

export const Toolbar = () => {
  const workSpaceId = useWorkSpaceId()
  const { data } = useGetWorkspaceById({ id: workSpaceId })

  return (
    <nav className="bg-[#4A154B] flex items-center justify-between h-10 p-1.5">
      <div className="flex-1 flex items-center justify-end px-2">
        <Button variant="transparent" size="iconSm">
          <ArrowLeft className="size-5"/>
        </Button>
        <Button variant="transparent" size="iconSm">
          <ArrowRight className="size-5"/>
        </Button>
        <Button variant="transparent" size="iconSm">
          <Clock3 className="size-5"/>
        </Button>
      </div>
      <div className="min-w-[280px] max-w-[642px] grow-2 shrink">
        <Button size="sm" className="bg-accent/25 hover:bg-accent/25 w-full justify-start h-7 px-2">
          <Search />
          <span className="text-white text-xs font-normal">Search {data?.name}</span>
        </Button>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant="transparent" size="iconSm">
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  )
}