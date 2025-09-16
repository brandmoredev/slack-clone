"use client"

import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Doc, Id } from "../../../convex/_generated/dataModel"
import dynamic from "next/dynamic"

const Renderer = dynamic(() => import("@/components/messages/Renderer"), { ssr: false })

export interface Reaction {
  messageId: Id<"messages">
  value: string;
  count: number;
  memberIds: Id<"messages">[]
}

interface MessageItemProps {
  id: Id<"messages">
  body: Doc<"messages">["body"]
  image?: string | null;
  createdAt: number;
  updatedAt?: number;

  // Author
  authorName: string;
  authorImage?: string;

  // Reactions
  reactions?: Reaction[]

  // Threads
  threadCount?: number;
  threadImage?: string;
  threadTimestamp?: number;
}

export const MessageItem = ({
  id,
  body,
  createdAt,
  updatedAt,
  authorName,
  authorImage,
  image,
  reactions = [],
  threadCount = 0,
  threadImage,
  threadTimestamp,
}: MessageItemProps) => {
  const timestamp = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
  })

  return (
    <div className="flex gap-4 px-4 py-3 hover:bg-muted/50 transition group w-full">
      {/* Avatar */}
      <Avatar className="h-9 w-9 mt-1">
        <AvatarImage src={authorImage || ""} alt={authorName} />
        <AvatarFallback className="bg-white">{authorName.charAt(0)}</AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">{authorName}</p>
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </div>

        <div className="text-sm whitespace-pre-wrap break-words text-primary mt-0.5">
          {/* {content} */}
          <Renderer value={body} />
        </div>

        {/* Optional Image */}
        {image && (
          <div className="mt-2">
            <Image
              src={image}
              alt="message image"
              width={300}
              height={200}
              className="rounded-md object-cover"
            />
          </div>
        )}

        {/* Reactions */}
        {reactions.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-2">
            {reactions.map((reaction: Reaction) => (
              <div
                key={reaction.value}
                className="px-2 py-0.5 rounded-full bg-muted text-sm flex items-center gap-1 border border-gray-300 hover:bg-accent"
              >
                <span>{reaction.value}</span>
                <span>{reaction.count}</span>
              </div>
            ))}
          </div>
        )}

        {/* Thread Summary */}
        {threadCount > 0 && (
          <div className="mt-3 ml-1 border-l-2 border-muted pl-4 py-2 text-sm text-muted-foreground flex items-center gap-3 hover:bg-muted/30 rounded cursor-pointer">
            <span className="font-medium">
              {threadCount} {threadCount === 1 ? "reply" : "replies"}
            </span>
            {threadImage && (
              <Image
                src={threadImage}
                alt="thread image"
                width={40}
                height={40}
                className="rounded object-cover"
              />
            )}
            {threadTimestamp && (
              <span className="text-xs ml-auto">
                {formatDistanceToNow(new Date(threadTimestamp), {
                  addSuffix: true,
                })}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
