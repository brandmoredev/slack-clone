import { useCreateMessage } from "@/features/messages/api/useCreateMessage"
import { useChannelId } from "@/hooks/useChannelId"
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId"
import dynamic from "next/dynamic"
import Quill from "quill"
import { useRef, useState } from "react"
import { toast } from "sonner"

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false })

interface ChatInputProps {
  placeholder: string
}

interface HandleSubmitProps {
  body: string;
  image: File | null;
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0)
  const [isPending, setIsPending] = useState(false)
  const editorRef = useRef<Quill | null>(null)

  const workspaceId = useWorkSpaceId()
  const channelId = useChannelId()
  const { mutate: createMessage } = useCreateMessage()


  const handleSubmit = async ({
    body,
    image
  }: HandleSubmitProps) => {
    console.log({ body, image })

    try {
      await createMessage({
        workspaceId,
        channelId,
        body
      }, { throwError: true })

      setEditorKey(prev => prev + 1)
    } catch {
        toast.error("Failed to send message")
    } finally {
      setIsPending(false)
    }

  }


  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
      />
    </div>
  )
}