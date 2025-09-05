"use client"

import { Toolbar } from "./toolbar"

interface WorkSpaceIdLayourProp {
  children: React.ReactNode
}

const WorkSpaceLayout = ({ children }: WorkSpaceIdLayourProp) => {
  return (
    <div className="h-full">
      <Toolbar />
      {children}
    </div>
  )
}

export default WorkSpaceLayout
