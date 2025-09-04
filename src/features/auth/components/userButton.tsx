"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCurrentUser } from "../hooks/useCurrentUser"
import { Loader, LogOut } from "lucide-react"
import { useAuthActions } from "@convex-dev/auth/react"


const UserButton = () => {
  const { signOut } = useAuthActions();
  const { data, isLoading } = useCurrentUser()

  if (isLoading) {
    return (
      <Loader className="size-4 animate-spin text-muted-foreground"/>
    )
  }

  if (!data) {
    return null
  }

  console.log("USER", data)
  const { name, image } = data

  const avatarFallback = name?.charAt(0).toUpperCase();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none cursor-pointer">
        <Avatar className="size-10 hover:opacity-75 transition">
          <AvatarImage alt={name} src={image} />
          <AvatarFallback className="bg-[#4A154E]/80 text-white">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>

      </DropdownMenuTrigger>

      <DropdownMenuContent align="center" side="right" className="w-60">
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="size-4 mr-2" />
          Sign out
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>  )
}

export default UserButton
