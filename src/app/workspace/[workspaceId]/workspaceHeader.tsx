import { Button } from "@/components/ui/button"
import { Hint } from "@/components/ui/hint"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, Settings } from "lucide-react"
import { PiCaretDown } from "react-icons/pi"
import { Doc } from "../../../../convex/_generated/dataModel"
import { PreferencesModal } from "./(preferences)/preferencesModal"
import { useState } from "react"

interface WorkSpaceHeaderProps {
  workspace: Doc<"workspaces">,
  isAdmin: boolean
}
export const WorkspaceHeader = ({ workspace, isAdmin }: WorkSpaceHeaderProps) => {
  const [preferencesOpen, setPreferencesOpen] = useState(false)

  return (
    <>
      {preferencesOpen && <PreferencesModal open={preferencesOpen} setOpen={setPreferencesOpen} workspace={workspace}/>}
      <div className="w-full flex justify-between items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
              <Button variant="transparent" className="text-lg font-bold shrink overflow-hidden">
                <span className="truncate text-left min-w-3">{workspace.name}</span>
                <PiCaretDown className="size-3 shrink-0"/>
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start" className="w-72">
            <DropdownMenuItem className="cursor-pointer capitalize flex">
              <div className="size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2">
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col items-start">
                <p className="font-bold">{workspace.name}</p>
                <p className="text-xs text-muted-foreground">Active workspace</p>
              </div>
            </DropdownMenuItem>

            { isAdmin && (
              <>
                <DropdownMenuSeparator/>
                <DropdownMenuItem
                  className="cursor-pointer py-2"
                  onClick={() => {}}
                >
                  Invite people to {workspace.name}
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem
                  className="cursor-pointer py-2"
                  onClick={() => {setPreferencesOpen(true)}}
                >
                  Preferences
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center justify-end gap-2">
          <Hint label="Settings" side="bottom">
            <Button variant="transparent" size="iconSm">
              <Settings className="size-5 text-accent/70"/>
            </Button>
          </Hint>
          <Hint label="New Message" side="bottom">
            <Button variant="transparent" size="iconSm">
              <Edit className="size-5 text-accent/70"/>
            </Button>
          </Hint>
        </div>
      </div>
    </>
  )
}