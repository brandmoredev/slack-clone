import Quill, { Delta, Op, QuillOptions } from "quill"
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react"

import "quill/dist/quill.snow.css"
import { Button } from "./ui/button"
import { PiTextAa } from "react-icons/pi"
import { MdSend } from "react-icons/md"
import { ImageIcon, Smile, XIcon } from "lucide-react"
import { Hint } from "./ui/hint"
import { EmojiPopover } from "./ui/EmojiPopover"
import { EmojiClickData } from "emoji-picker-react"
import Image from "next/image"

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
  const [image, setImage] = useState<File | null>(null)
  const [isToolbarVisible, setIsToolbarVisible] = useState(true)

  const containerRef = useRef<HTMLDivElement>(null)

  const submitRef = useRef(onSubmit)
  const placeholderRef = useRef(placeholder)
  const quillRef = useRef<Quill | null>(null)
  const defaultValueRef = useRef(defaultValue)
  const disabledRef = useRef(disabled)
  const imageElementRef = useRef<HTMLInputElement>(null)

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
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          [{ list: "ordered"}, { list: "bullet" }]
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                const text = quill.getText();
                const addedImage = imageElementRef.current?.files?.[0] || null

                const isEmpty = !addedImage && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

                if (isEmpty) return;

                const body = JSON.stringify(quill.getContents());
                submitRef.current?.({ body, image: addedImage })

                return false;
              }
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n")
              }
            }
          },
        }
      }
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

  const toggleToolbar = () => {
    setIsToolbarVisible((current) => !current)
    const toolbarElement = containerRef?.current?.querySelector(".ql-toolbar");

    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden")
    }
  }

  const onEmojiClick = (emoji: EmojiClickData) => {
    const quill = quillRef.current;

    if (!quill) return;

    quill.focus();
    const selection = quill.getSelection();
    const index = selection?.index ?? 0;
    console.log(text)

    quill.insertText(index, emoji.emoji);

    quill.focus();
  };

  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <div className="flex flex-col pb-2.5">
      <input
        type="file"
        accept="image/*"
        ref={imageElementRef}
        className="hidden"
        onChange={(e) => {
          setImage(e.target.files![0])
          quillRef.current?.focus()
        }}
      />
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
        <div ref={containerRef} className="h-full ql-custom"/>
        { !!image &&
          <div className="p-2">
            <div className="relative size-[62px] flex items-center justify-center group/image">
              <Hint label="Remove image">
                <button
                  onClick={() => {
                    setImage(null)
                    imageElementRef.current!.value = ""
                  }}
                  className="hidden group-hover/image:flex items-center justify-center rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[2] border-2 border-white cursor-pointer"
                >
                  <XIcon className="size-4"/>
                </button>
              </Hint>
              <Image
                src={URL.createObjectURL(image)}
                alt="Uploaded"
                fill
                className="rounded-xl overflow-hidden border object-cover"
              />
            </div>
          </div>
        }
        <div className="flex px-2 pb-2 z-[5]">
          <Hint label={isToolbarVisible ? "Hide formatting" : "Show formatting"}>
            <Button
              disabled={disabled}
              variant="ghost"
              onClick={toggleToolbar}
            >
              <PiTextAa className="size-4"/>
            </Button>
          </Hint>
          <EmojiPopover onEmojiClick={onEmojiClick}>
            <Button
              disabled={disabled}
              variant="ghost"
            >
              <Smile className="size-4"/>
            </Button>
          </EmojiPopover>
          { variant === "update" &&
            <div className="ml-auto flex items-center gap-x-2">
            <Button
              disabled={disabled}
              variant="ghost"
              size="sm"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              disabled={disabled || isEmpty}
              size="sm"
              className="bg-[#007A5A] text-white hover:bg-[#007A5A]/80"
              onClick={() => {
                onSubmit({
                  body: JSON.stringify(quillRef.current?.getContents()),
                  image
                })
              }}
            >
              Save
            </Button>
            </div>
          }
          { variant === "create" &&
            <Hint label="image">
              <Button
                disabled={disabled}
                variant="ghost"
                onClick={() => {imageElementRef.current?.click()}}
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          }
          { variant === "create" &&
            <Button
              disabled={disabled || isEmpty}
              size="iconSm"
              className="ml-auto bg-[#007A5A]"
              onClick={() => {
                onSubmit({
                  body: JSON.stringify(quillRef.current?.getContents()),
                  image
                })
              }}
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