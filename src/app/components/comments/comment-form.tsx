"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CommentFormProps {
  onSubmit: (content: string) => void
  placeholder?: string
  buttonText?: string
  isReply?: boolean
  onCancel?: () => void
}

export function CommentForm({
  onSubmit,
  placeholder = "Share your thoughts...",
  buttonText = "Post Comment",
  isReply = false,
  onCancel,
}: CommentFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      onSubmit(content)
      setContent("")
      setIsSubmitting(false)
    }, 500)
  }

  return (
    <form onSubmit={handleSubmit} className={`${isReply ? "mt-2" : "mb-8"}`}>
      <div className="flex gap-4">
        {!isReply && (
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg?height=50&width=50" alt="Your avatar" />
            <AvatarFallback>YA</AvatarFallback>
          </Avatar>
        )}
        <div className="flex-1">
          <Textarea
            placeholder={placeholder}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`resize-none ${isReply ? "h-20" : "h-28"}`}
          />
          <div className={`flex ${isReply ? "justify-end mt-2" : "justify-between mt-4"}`}>
            {onCancel && (
              <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={!content.trim() || isSubmitting}>
              {isSubmitting ? "Posting..." : buttonText}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

