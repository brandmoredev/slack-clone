import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority"

interface SidebarItemProps {
  label: string;
  icon: LucideIcon | IconType;
  isActive?: boolean;
  variant?: VariantProps<typeof sidebarItemVariants>["variant"]
}

const sidebarItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-md overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-accent",
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
  isActive,
  variant
}: SidebarItemProps) => {
  return (
    <Button
      variant="transparent"
      className={cn(sidebarItemVariants({ variant }))}>
      <Icon />
      <span className="font-normal">{label}</span>
    </Button>
  )
}