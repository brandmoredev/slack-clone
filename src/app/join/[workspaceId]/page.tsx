"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId"
import { useGetWorkspacePublicById } from "@/features/workspaces/api/useGetWorkspacePublicById"
import { FaSlack } from "react-icons/fa"
import { Loader } from "lucide-react"
import { useJoin } from "@/features/workspaces/api/useJoin"
import { useCurrentUser } from "@/features/auth/api/useCurrentUser"
import { Id } from "../../../../convex/_generated/dataModel"

const JoinWorkspacePage = () => {
  const router = useRouter()
  const { data:user, isLoading } = useCurrentUser();
  const workspaceId = useWorkSpaceId();
  const { data: workspace } = useGetWorkspacePublicById({ id: workspaceId })
  const { mutate, isPending } = useJoin()
  const [code, setCode] = useState("")


  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground"/>
      </div>
    )
  }

  if (!user) {
    router.push('/auth')
    toast.info("You must be logged in!")
  }

  if (workspace?.isMember) {
    router.replace(`/workspace/${workspaceId}`)
    toast.info("You are already a member of this workspace.")
    return
  }

  const handleJoin = async (value: string) => {
    mutate({
      workspaceId,
      joinCode: value
    },
    {
      onSuccess: (id: Id<"workspaces"> | null) => {
        router.replace(`/workspace/${id}`)
        toast.success("Workspace joined")
      },
      onError: () => {
        toast.error("Failed to join workspace")
      }
    }
  )
  }

  const handleChange = (value: string) => {
    setCode(value)
    if (value.length === 6) {
      handleJoin(value)
    }
  }

  return (
    <div className="flex flex-col items-center justify-start w-full h-full bg-muted">
      <div className="w-full min-h-40 bg-[#aa800010] py-20 flex flex-col items-center gap-6">
        <FaSlack className="size-10 text-[#4A154B]"/>
        <h1 className="text-5xl font-bold text-center ">
          See what <span className="text-[#4A154B]">{workspace?.name}</span> is up to
        </h1>
          <p className="text-center mt-2 text-lg">Slack is where work happens for companies of all sizes.</p>
      </div>


      <p className="mt-4 text-md text-center text-muted-foreground">
        Enter your workspace join code below
      </p>

      <div className="mt-6 space-y-4">
        <InputOTP
          maxLength={6}
          value={code}
          onChange={handleChange}
          disabled={isPending}
          autoFocus
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <Button
          className="w-full"
          onClick={() => handleJoin(code)}
          disabled={isPending}
        >
          {isPending ? "Joining…" : "Join Workspace"}
        </Button>
      </div>
    </div>
  )
}

export default JoinWorkspacePage;