"use client"

import { cn } from "@/lib/utils"

interface EditorPreviewProps {
  content: string
  className?: string
}

export function EditorPreview({ content, className }: EditorPreviewProps) {
  return <div className={cn("prose prose-sm max-w-none", className)} dangerouslySetInnerHTML={{ __html: content }} />
}
