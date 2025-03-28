"use client"

import { useState } from "react"
// import { formatDistanceToNow } from "date-fns"
import type { Comment } from "./comment-section"
import { CommentForm } from "./comment-form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageSquare } from "lucide-react"

interface CommentItemProps {
  comment: Comment
  onReply: (commentId: string, content: string) => void
  onLike: (commentId: string, isReply?: boolean, parentId?: string) => void
  isReply?: boolean
  parentId?: string
}

export function CommentItem({ comment, onReply, onLike, isReply = false, parentId }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [hasLiked, setHasLiked] = useState(false)

  const handleReplySubmit = (content: string) => {
    onReply(comment.id, content)
    setIsReplying(false)
  }

  const handleLike = () => {
    if (!hasLiked) {
      onLike(comment.id, isReply, parentId)
      setHasLiked(true)
    }
  }

  const formattedDate = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })

  return (
    <div className={`${isReply ? "pl-12 mt-4" : "border-t pt-6"}`}>
      <div className="flex gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={comment.author.image} alt={comment.author.name} />
          <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{comment.author.name}</span>
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>
          <div className="mb-3">
            <p className="text-sm">{comment.content}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground hover:text-primary"
              onClick={handleLike}
              disabled={hasLiked}
            >
              <Heart className={`h-4 w-4 mr-1 ${hasLiked ? "fill-primary text-primary" : ""}`} />
              <span>{comment.likes}</span>
            </Button>
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-muted-foreground hover:text-primary"
                onClick={() => setIsReplying(!isReplying)}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                <span>Reply</span>
              </Button>
            )}
          </div>

          {isReplying && (
            <div className="mt-4">
              <CommentForm
                onSubmit={handleReplySubmit}
                placeholder="Write a reply..."
                buttonText="Reply"
                isReply={true}
                onCancel={() => setIsReplying(false)}
              />
            </div>
          )}

          {!isReply && comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onLike={onLike}
                  isReply={true}
                  parentId={comment.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

