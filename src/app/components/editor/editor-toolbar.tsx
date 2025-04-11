"use client"

import type { Editor } from "@tiptap/react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  ImageIcon,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Quote,
} from "lucide-react"

interface EditorToolbarProps {
  editor: Editor | null
  onFormat: (command: string) => void
  onHeading: (level: number) => void
  onLink: () => void
  onImage: () => void
  readOnly?: boolean
}

export function EditorToolbar({ editor, onFormat, onHeading, onLink, onImage, readOnly = false }: EditorToolbarProps) {
  const ToolbarButton = ({
    icon: Icon,
    command,
    tooltip,
    onClick,
    isActive = false,
  }: {
    icon: React.ElementType
    command?: string
    tooltip: string
    onClick?: () => void
    isActive?: boolean
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isActive ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              if (onClick) {
                onClick()
              } else if (command) {
                onFormat(command)
              }
            }}
            disabled={readOnly || !editor}
          >
            <Icon className="h-4 w-4" />
            <span className="sr-only">{tooltip}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  if (!editor) {
    return <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/30">Loading editor...</div>
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/30">
      <ToolbarButton icon={Bold} command="bold" tooltip="Bold (Ctrl+B)" isActive={editor.isActive("bold")} />
      <ToolbarButton icon={Italic} command="italic" tooltip="Italic (Ctrl+I)" isActive={editor.isActive("italic")} />
      <ToolbarButton
        icon={Underline}
        command="underline"
        tooltip="Underline (Ctrl+U)"
        isActive={editor.isActive("underline")}
      />
      <ToolbarButton
        icon={Strikethrough}
        command="strike"
        tooltip="Strikethrough"
        isActive={editor.isActive("strike")}
      />

      <Separator orientation="vertical" className="mx-1 h-6" />

      <ToolbarButton
        icon={Heading1}
        tooltip="Heading 1"
        onClick={() => onHeading(1)}
        isActive={editor.isActive("heading", { level: 1 })}
      />
      <ToolbarButton
        icon={Heading2}
        tooltip="Heading 2"
        onClick={() => onHeading(2)}
        isActive={editor.isActive("heading", { level: 2 })}
      />
      <ToolbarButton
        icon={Heading3}
        tooltip="Heading 3"
        onClick={() => onHeading(3)}
        isActive={editor.isActive("heading", { level: 3 })}
      />

      <Separator orientation="vertical" className="mx-1 h-6" />

      <ToolbarButton
        icon={AlignLeft}
        command="alignLeft"
        tooltip="Align Left"
        isActive={editor.isActive({ textAlign: "left" })}
      />
      <ToolbarButton
        icon={AlignCenter}
        command="alignCenter"
        tooltip="Align Center"
        isActive={editor.isActive({ textAlign: "center" })}
      />
      <ToolbarButton
        icon={AlignRight}
        command="alignRight"
        tooltip="Align Right"
        isActive={editor.isActive({ textAlign: "right" })}
      />

      <Separator orientation="vertical" className="mx-1 h-6" />

      <ToolbarButton icon={List} command="bulletList" tooltip="Bullet List" isActive={editor.isActive("bulletList")} />
      <ToolbarButton
        icon={ListOrdered}
        command="orderedList"
        tooltip="Numbered List"
        isActive={editor.isActive("orderedList")}
      />
      <ToolbarButton icon={Quote} command="blockquote" tooltip="Quote" isActive={editor.isActive("blockquote")} />

      <Separator orientation="vertical" className="mx-1 h-6" />

      <ToolbarButton icon={Link} tooltip="Insert Link (Ctrl+K)" onClick={onLink} isActive={editor.isActive("link")} />
      <ToolbarButton icon={ImageIcon} tooltip="Insert Image" onClick={onImage} />
      <ToolbarButton icon={Code} command="codeBlock" tooltip="Code Block" isActive={editor.isActive("codeBlock")} />

      <Separator orientation="vertical" className="mx-1 h-6" />

      <ToolbarButton icon={Undo} command="undo" tooltip="Undo" />
      <ToolbarButton icon={Redo} command="redo" tooltip="Redo" />
    </div>
  )
}
