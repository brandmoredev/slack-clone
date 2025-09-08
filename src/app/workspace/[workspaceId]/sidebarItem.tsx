import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority"
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId";
import Link from "next/link";

interface SidebarItemProps {
  label: string;
  icon: LucideIcon | IconType;
  id: string,
  isActive?: boolean;
  variant?: VariantProps<typeof sidebarItemVariants>["variant"],
  className?: string,
  onClick?: () => void
}

const sidebarItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-md overflow- w-full",
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


export const SidebarItem = ({
  label,
  icon: Icon,
  id,
  isActive,
  variant,
  className,
  onClick
}: SidebarItemProps) => {
  const appliedVariant = isActive ? "active" : (variant ?? "default")

  const workspaceId = useWorkSpaceId()

  return (
    <Link
      href={onClick ? "#" : `/workspace/${workspaceId}/channel/${id}` }
    >
      <Button
        variant="transparent"
        className={cn(sidebarItemVariants({ variant: appliedVariant }), className)}
        onClick={onClick}
      >
          <Icon className="size-4 shrink-0"/>
          <span className="font-normal text-md truncate">{label}</span>
      </Button>
    </Link>
  )
}