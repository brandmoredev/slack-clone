"use client"

import { GlobalContext } from "@/components/ContextProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Header } from "@/components/ui/Header/Header";
import { ProgressBar } from "@/components/ui/Loader/ProgressBar";
import { useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces";
import { WorkSpacesCard } from "@/features/workspaces/components/workSpacesCard";
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
      // router.replace(`/workspace/${workspaceId}`)
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

  // if (workspaceId) return null;

  return (
    <div className="bg-[#4A154B] h-full w-full">
      <Header />

      <div className="p-6 space-y-5 w-full">
        <WorkSpacesCard workspaces={data!} />
        <Card className="rounded-sm">
          <CardHeader>
            <CardContent className="flex justify-between items-center">
              <h1 className="text-lg font-semibold">Want to use Slack with a different team?</h1>
              <Button variant="outline">CREATE A NEW WORKSPACE</Button>
            </CardContent>
          </CardHeader>
        </Card>
      </div>

    </div>
  );
}
