"use client"

import type { Comment } from "./comment-section"
import { CommentItem } from "./comment-item"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CommentListProps {
  comments: Comment[]
  onReply: (commentId: string, content: string) => void
  onLike: (commentId: string, isReply?: boolean, parentId?: string) => void
  sortBy: "newest" | "oldest" | "popular"
  onSortChange: (value: "newest" | "oldest" | "popular") => void
}

export function CommentList({ comments, onReply, onLike, sortBy, onSortChange }: CommentListProps) {
  const commentCount = comments.reduce((count, comment) => {
    return count + 1 + (comment.replies?.length || 0)
  }, 0)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-medium">
          {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={sortBy} onValueChange={(value) => onSortChange(value as "newest" | "oldest" | "popular")}>
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="popular">Most Liked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {comments.length === 0 ? (
        <div className="text-center py-8 border-t">
          <p className="text-muted-foreground">Be the first to comment on this post!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} onReply={onReply} onLike={onLike} />
          ))}
        </div>
      )}
    </div>
  )
}

