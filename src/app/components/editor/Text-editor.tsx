"use client"

import { useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import TextAlign from "@tiptap/extension-text-align"
import { EditorToolbar } from "./editor-toolbar"
import { ImageUploader } from "./image-uploader"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export interface TextEditorProps {
  initialValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  minHeight?: string
  className?: string
  readOnly?: boolean
  onRawFilesChange?: any
}

export function TextEditor({
  initialValue = "",
  onChange,
  placeholder = "Start writing...",
  minHeight = "300px",
  className,
  readOnly = false,
  onRawFilesChange,
}: TextEditorProps) {
  const [showImageUploader, setShowImageUploader] = useState(false)
  const [postImage, setPostImage] = useState()
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline underline-offset-2 hover:text-primary/80",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-md max-w-full",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          "is-editor-empty before:content-[attr(data-placeholder)] before:text-muted-foreground before:float-left before:pointer-events-none",
      }),
    ],
    content: initialValue,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange?.(html)
    },
  })

  // Handle formatting
  const formatText = (type: string) => {
    if (!editor) return

    switch (type) {
      case "bold":
        editor.chain().focus().toggleBold().run()
        break
      case "italic":
        editor.chain().focus().toggleItalic().run()
        break
      case "underline":
        editor.chain().focus().toggleUnderline().run()
        break
      case "strike":
        editor.chain().focus().toggleStrike().run()
        break
      case "code":
        editor.chain().focus().toggleCode().run()
        break
      case "clearFormatting":
        editor.chain().focus().unsetAllMarks().run()
        break
      case "alignLeft":
        editor.chain().focus().setTextAlign("left").run()
        break
      case "alignCenter":
        editor.chain().focus().setTextAlign("center").run()
        break
      case "alignRight":
        editor.chain().focus().setTextAlign("right").run()
        break
      case "bulletList":
        editor.chain().focus().toggleBulletList().run()
        break
      case "orderedList":
        editor.chain().focus().toggleOrderedList().run()
        break
      case "blockquote":
        editor.chain().focus().toggleBlockquote().run()
        break
      case "codeBlock":
        editor.chain().focus().toggleCodeBlock().run()
        break
      case "undo":
        editor.chain().focus().undo().run()
        break
      case "redo":
        editor.chain().focus().redo().run()
        break
      default:
        break
    }
  }

  // Handle headings
  const insertHeading = (level: number) => {
    if (!editor) return
    editor
      .chain()
      .focus()
      .toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 })
      .run()
  }

  // Handle link insertion
  const insertLink = () => {
    if (!editor) return

    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("URL", previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  // Handle image insertion
  const handleImageUpload = (file: File) => {
    if (!editor) return

    // In a real app, you would upload this to a server and get a URL back
    // For this example, we'll use a FileReader to create a data URL
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        // Insert image at current position
        editor
          .chain()
          .focus()
          .setImage({
            src: e.target.result as string,
            alt: file.altText || file.name,
          })
          .run()
        setPostImage(file)
        onRawFilesChange(file)
        setShowImageUploader(false)
        toast.success("Image uploaded", {
          description: "Your image has been added to the editor",
        })
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className={cn("border rounded-md", className)}>
      <EditorToolbar
        editor={editor}
        onFormat={formatText}
        onHeading={insertHeading}
        onLink={insertLink}
        onImage={() => setShowImageUploader(true)}
        readOnly={readOnly}
      />

      <div className="prose prose-sm max-w-none p-4" style={{ minHeight }}>
        <EditorContent editor={editor} className="outline-none min-h-full" />
      </div>

      {showImageUploader && (
        <div className="p-4 border-t">
          <ImageUploader onUpload={handleImageUpload} onCancel={() => setShowImageUploader(false)} />
        </div>
      )}
    </div>
  )
}
