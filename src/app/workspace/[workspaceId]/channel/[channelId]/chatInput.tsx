import { useCreateMessage } from "@/features/messages/api/useCreateMessage"
import { useGenerateUploadURL } from "@/features/upload/api/useGenerateUploadURL"
import { useChannelId } from "@/hooks/useChannelId"
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId"
import dynamic from "next/dynamic"
import Quill from "quill"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { Id } from "../../../../../../convex/_generated/dataModel"

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false })

interface ChatInputProps {
  placeholder: string
}

interface CreateMessageValues {
  workspaceId: Id<"workspaces">;
  body: string;
  channelId?: Id<"channels">;
  conversationId?: Id<"conversations">;
  image?: Id<"_storage">
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
  const { mutate: generateUploadURL } = useGenerateUploadURL()


  const handleSubmit = async ({
    body,
    image
  }: HandleSubmitProps) => {
    try {
      setIsPending(true)
      editorRef.current?.enable(false)

      const values: CreateMessageValues = {
        workspaceId,
        channelId,
        body,
        image: undefined
      }

      if (image) {
        const url = await generateUploadURL({}, { throwError: true })

        if (!url) {
          throw new Error("URL not found")
        }

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image
        })

        if (!result.ok) {
          throw new Error("Failed to upload image")
        }

        const { storageId } = await result.json()

        values.image = storageId
      }

      await createMessage(values, { throwError: true })

      setEditorKey(prev => prev + 1)
    } catch {
        toast.error("Failed to send message")
    } finally {
      setIsPending(false)
      editorRef.current?.enable(true)
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