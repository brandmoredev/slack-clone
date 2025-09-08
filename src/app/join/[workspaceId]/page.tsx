"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId"
import { useGetWorkspacePublicById } from "@/features/workspaces/api/useGetWorkspacePublicById"
import Image from "next/image"
import { FaSlack } from "react-icons/fa"

const JoinWorkspacePage = () => {
  const router = useRouter()
  const workspaceId = useWorkSpaceId();
  const { data: workspace, isLoading } = useGetWorkspacePublicById({ id: workspaceId })
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)

  const handleJoin = async () => {
    if (!code.trim()) {
      toast.error("Please enter a valid join code.")
      return
    }
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((res) => setTimeout(res, 1000))
      toast.success("Successfully joined workspace!")
      router.push(`/workspace/${code.trim()}`) // adjust route as necessary
    } catch {
      toast.error("Failed to join workspace.")
    } finally {
      setLoading(false)
    }
  }

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleJoin()
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
        <InputOTP maxLength={6}>
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
          onClick={handleJoin}
          disabled={loading}
        >
          {loading ? "Joining…" : "Join Workspace"}
        </Button>
      </div>
    </div>
  )
}

export default JoinWorkspacePage;