"use client"

import { SideBar } from "./(sidebar)/sidebar"
import { Toolbar } from "./toolbar"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { WorkspaceSideBar } from "./(workspaceSideBar)/workspaceSideBar"
import { useEffect, useState } from "react"


interface WorkSpaceIdLayourProp {
  children: React.ReactNode
}

const WorkSpaceLayout = ({ children }: WorkSpaceIdLayourProp) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)] bg-[#4A154B]">
        <SideBar />
        <div className="flex-1 p-1">
          { isClient &&
            <ResizablePanelGroup
              id="resizable-workspace"
              direction="horizontal"
              className="rounded-lg"
              autoSaveId="handle-workspace-layout"
            >
              <ResizablePanel
                defaultSize={20}
                minSize={11}
                className="max-w-md"
              >
                <WorkspaceSideBar />
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel
                defaultSize={80}
                minSize={20}
                className="bg-accent"
              >
                {children}
              </ResizablePanel>
              <ResizableHandle />
            </ResizablePanelGroup>
          }
        </div>
      </div>
    </div>
  )
}

export default WorkSpaceLayout
