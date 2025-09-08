import { FaCaretRight } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Hint } from "@/components/ui/hint";
import { useState } from "react";
import { cn } from "@/lib/utils";


interface WorkspaceSectionProps {
  children: React.ReactNode;
  label?: string,
  hint: string,
  onNew?: () => void
}

export const WorkspaceSection = ({
  children,
  label,
  hint,
  onNew
}: WorkspaceSectionProps) => {
  const [toggle, setToggle] = useState(false)

  return (
    <div className="flex flex-col mt-3">
      <div className="flex justify-between items-center">
        <Button
          variant="transparent"
          className="flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-md overflow-50 text-[#F9EDFFCC]"
          onClick={() => setToggle(!toggle)}
        >
          <FaCaretRight
            className={cn(
              "size-4 transition-transform",
              toggle && "rotate-90"
            )
            }
          />
          <span className="font-normal text-md truncate">{label}</span>
        </Button>
        {onNew &&
          <Hint label={hint} side="top" align="center">
            <Button
              variant="transparent"
              className="flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-md overflow-50 text-[#F9EDFFCC]"
              onClick={onNew}
            >
              <PlusIcon />
            </Button>
          </Hint>
        }
      </div>
      {toggle && children }
    </div>
  )
}