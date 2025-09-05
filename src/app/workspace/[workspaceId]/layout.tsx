"use client"

import { SideBar } from "./sidebar"
import { Toolbar } from "./toolbar"

interface WorkSpaceIdLayourProp {
  children: React.ReactNode
}

const WorkSpaceLayout = ({ children }: WorkSpaceIdLayourProp) => {
  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <SideBar />
        {children}
      </div>
    </div>
  )
}

export default WorkSpaceLayout
