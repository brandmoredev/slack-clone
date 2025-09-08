"use client"

import { CreateChannelModal } from "@/features/channels/components/createChannelModal";
import { CreateWorkSpaceModal } from "@/features/workspaces/components/createWorkSpacesModal";

export const Modals = () => {
  return (
    <>
      <CreateWorkSpaceModal />
      <CreateChannelModal />
    </>
  )
}
