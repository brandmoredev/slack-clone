import dynamic from "next/dynamic"
import Quill from "quill"
import { useRef } from "react"

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false })

interface ChatInputProps {
  placeholder: string
}

interface HandleSubmitProps {
  body: string;
  image: File | null;
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null)

  const handleSubmit = ({
    body,
    image
  }: HandleSubmitProps) => {
    console.log({ body, image })
  }

  return (
    <div className="px-5 w-full">
      <Editor
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={false}
        innerRef={editorRef}
      />
    </div>
  )
}