import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority"
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId";
import Link from "next/link";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserItemProps {
  id: Id<"users">
  label?: string;
  image?: string;
  variant?: VariantProps<typeof UserItemVariants>["variant"],
  isActive?: boolean;
  className?: string
}

const UserItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-2 text-md overflow- w-full",
  {
    variants: {
      variant: {
        default: "text-[#F9EDFFCC]",
        active: "text-[#481349] bg-white/90 hover:bg-white/90"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)


export const UserItem = ({
  id,
  label = "Member",
  image,
  isActive,
  variant,
  className
}: UserItemProps) => {
  const appliedVariant = isActive ? "active" : (variant ?? "default")
  const workspaceId = useWorkSpaceId()
  const avatarFallback = label.charAt(0).toLocaleUpperCase()

  return (
    <Link
      href={`/workspace/${workspaceId}/member/${id}`}
    >
      <Button
        variant="transparent"
        className={cn(UserItemVariants({ variant: appliedVariant }), className)}
      >
          <Avatar className="size-5 rounded-xs shrink-0">
            <AvatarImage src={image} className="rounded-xs" />
            <AvatarFallback className="bg-accent-foreground/80 text-accent">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <span className="text-md">{label}</span>
      </Button>
    </Link>
  )
}