import dynamic from 'next/dynamic';

const EmojiPicker = dynamic(
  () => {
    return import('emoji-picker-react');
  },
  { ssr: false }
);

import{ EmojiClickData } from 'emoji-picker-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { useState } from 'react';

interface EmojiPopoverProps {
  children: React.ReactNode;
  hint?: string;
  onEmojiClick: (emojiData: EmojiClickData, event: MouseEvent) => void;
}

export const EmojiPopover = ({
  children,
  hint = "Emoji",
  onEmojiClick,
}: EmojiPopoverProps) => {
  const [open, setOpen] = useState(false)

  const onSelect = (emoji: EmojiClickData, e: MouseEvent) => {
    onEmojiClick(emoji, e)
    setOpen(false)
  }

  return (
    <TooltipProvider>
      <Popover open={open} onOpenChange={setOpen}>
        <Tooltip>
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>
                  {children}
            </TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className="bg-black text-white font-semibold">
            {hint}
          </TooltipContent>
          <PopoverContent className="w-80">
            <EmojiPicker
              onEmojiClick={onSelect}
              lazyLoadEmojis={true}
            />
          </PopoverContent>
        </Tooltip>
      </Popover>
    </TooltipProvider>
  );
};
