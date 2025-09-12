import Quill, { Delta, Op, QuillOptions } from "quill"
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react"

import "quill/dist/quill.snow.css"
import { Button } from "./ui/button"
import { PiTextAa } from "react-icons/pi"
import { MdSend } from "react-icons/md"
import { ImageIcon, Smile } from "lucide-react"
import { Hint } from "./ui/hint"

type EditorValue = {
  image: File | null;
  body: string
}

interface EditorProps {
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: RefObject<Quill | null>
  variant?: "create" | "update";
}

const Editor = ({
  onCancel,
  onSubmit,
  placeholder = "Write something",
  defaultValue = [],
  disabled = false,
  innerRef,
  variant = "create",
  
}: EditorProps) => {
  const [text, setText] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  const submitRef = useRef(onSubmit)
  const placeholderRef = useRef(placeholder)
  const quillRef = useRef<Quill | null>(null)
  const cancelRef = useRef(onCancel)
  const defaultValueRef = useRef(defaultValue)
  const disabledRef = useRef(disabled)

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled
  })


  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    )

    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current
    }

    const quill = new Quill(editorContainer, options)
    quillRef.current = quill;
    quillRef.current.focus()

    if (innerRef) {
      innerRef.current = quill
    }

    quill.setContents(defaultValueRef.current)
    setText(quill.getText())

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText())
    })

    return () => {
      quill.off(Quill.events.TEXT_CHANGE)
      if (container) {
        container.innerHTML = ""
      }
      quillRef.current = null
      if (innerRef) {
        innerRef.current = null
      }
    }
  }, [innerRef])


  return (
    <div className="flex flex-col pb-2.5">
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
        <div ref={containerRef} className="h-full ql-custom"/>
        <div className="flex px-2 pb-2 z-[5]">
          <Hint label="Hide formatting">
            <Button
              disabled={false}
              variant="ghost"
              onClick={() => {}}
            >
              <PiTextAa className="size-4"/>
            </Button>
          </Hint>
          <Hint label="emoji">
            <Button
              disabled={false}
              variant="ghost"
              onClick={() => {}}
            >
              <Smile className="size-4"/>
            </Button>
          </Hint>
          { variant === "update" &&
            <div className="ml-auto flex items-center gap-x-2">
            <Button
              disabled={false}
              variant="ghost"
              size="sm"
              onClick={() => {}}
            >
              Cancel
            </Button>
            <Button
              disabled={false}
              size="sm"
              className="bg-[#007A5A] text-white hover:bg-[#007A5A]/80"
              onClick={() => {}}
            >
              Save
            </Button>
            </div>
          }
          { variant === "create" &&
            <Hint label="image">
              <Button
                disabled={false}
                variant="ghost"
                onClick={() => {}}
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          }
          { variant === "create" &&
            <Button
              disabled={false}
              size="iconSm"
              className="ml-auto bg-[#007A5A]"
              onClick={() => {}}
            >
              <MdSend className="size-4" />
            </Button>
          }
        </div>
      </div>
        <div className="p-2 text-[10px] text-muted-foreground flex justify-end">
          <p>
            <strong>Shift + return</strong> to add a new line
          </p>
        </div>
    </div>
  )
}

export default Editor