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
    if (!isLoading && !data) {
      setCreateWorkspaceOpen(true)
    }
  }, [isLoading, data, workspaceId, createWorkspaceOpen, setCreateWorkspaceOpen, router])

  return (
    <div className="bg-[#4A154B] h-full w-full">
      <Header />

      <div className="p-6 space-y-5 w-full">
        { isLoading
          ? (
              <div className="h-full flex flex-col justify-center items-center">
                <p className="text-accent">Checking for workspaces...</p>
                <ProgressBar className="text-accent" />
              </div>
            )
          : <WorkSpacesCard workspaces={data!} />

        }
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
