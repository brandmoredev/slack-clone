"use client"

import { GlobalContext } from "@/components/ContextProvider";
import { ProgressBar } from "@/components/ui/Loader/ProgressBar";
import UserButton from "@/features/auth/components/userButton";
import { useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useMemo } from "react";

export default function Home() {
  const router = useRouter()
  const { data, isLoading } = useGetWorkspaces();
  const { createWorkspaceOpen, setCreateWorkspaceOpen } = useContext(GlobalContext)

  const workspaceId = useMemo(() => data?.[0]?._id.toString(), [data])

  useEffect(() => {
    if (isLoading) return;

    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`)
    } else {
      setCreateWorkspaceOpen(true)
    }
  }, [workspaceId, isLoading, createWorkspaceOpen, setCreateWorkspaceOpen, router])

  if (isLoading) {
    return (
      <div className="h-full flex flex-col justify-center items-center">
        <p>Checking for workspaces...</p>
        <ProgressBar />
      </div>
    )
  }

  if (workspaceId) return null;

  return (
    <div>
      Home Page

      <UserButton />
    </div>
  );
}
