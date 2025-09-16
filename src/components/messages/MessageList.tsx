import { GetMessagesReturnType } from "@/features/messages/api/useGetMessages";
import { format, formatDate, isToday, isYesterday, parseISO } from "date-fns";
import { MessageItem, Reaction } from "./MessageItem";

interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: "channel" | "thread" | "conversation";
  data: GetMessagesReturnType;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

export const MessageList = ({
  memberName,
  memberImage,
  channelName,
  channelCreationTime,
  data,
  variant="channel",
  loadMore,
  isLoadingMore,
  canLoadMore
}: MessageListProps) => {
  const groupedMessages = data?.reduce(
  (groups, message) => {
    const date = new Date(message._creationTime)
    const dateKey = format(date, "yyyy-MM-dd")

    if (!groups[dateKey]) {
      groups[dateKey] = [message]
    } else {
      groups[dateKey].unshift(message)
    }

    return groups;
  }, {} as Record<string, typeof data>)

  function formatDateLabel(dateKey: string) {
  const date = parseISO(dateKey); // converts "2025-09-16" string into a Date object

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";

  return format(date, "MMM d, yyyy"); // fallback for other days
}


  return (
    <div className="flex-1 flex flex-col-reverse pb-2 overflow-y-auto">
      {Object.entries(groupedMessages)?.map(([dateKey, messages])=> (
        <div key={dateKey} className="">
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300"/>
            <span className="relative inline-block bg-white px-4 py-0.5 rounded full text-xs text-gray-500 border-gray-300 shadow-sm">
              {formatDateLabel(dateKey)}
            </span>
          </div>
          <div>
            {messages.map(message => (
              <MessageItem
                key={message._id}
                id={message._id}
                body={message.body}
                createdAt={message._creationTime}
                updatedAt={message.updatedAt}
                authorName={message.user.name!}
                authorImage={message.user.image}
                image={message.image}
                reactions={message.reactions as unknown as Reaction[]}
                threadCount={message.threadCount}
                threadImage={message.threadImage}
                threadTimestamp={message.threadsTimestamp}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}