"use client"

import { useState } from "react"
import { CommentForm } from "./comment-form"
import { CommentList } from "./comment-list"

export interface Comment {
  id: string
  content: string
  createdAt: string
  author: {
    name: string
    image: string
  }
  likes: number
  replies?: Comment[]
}

interface CommentSectionProps {
  postId: string
  initialComments?: Comment[]
}

export function CommentSection({ postId, initialComments = [] }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">("newest")

  const addComment = (content: string) => {
    // In a real app, you would send this to your API
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      author: {
        name: "Current User", // In a real app, get from auth
        image: "/placeholder.svg?height=50&width=50",
      },
      likes: 0,
      replies: [],
    }

    setComments([newComment, ...comments])
  }

  const addReply = (commentId: string, content: string) => {
    // In a real app, you would send this to your API
    const newReply: Comment = {
      id: `reply-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      author: {
        name: "Current User", // In a real app, get from auth
        image: "/placeholder.svg?height=50&width=50",
      },
      likes: 0,
    }

    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply],
        }
      }
      return comment
    })

    setComments(updatedComments)
  }

  const likeComment = (commentId: string, isReply = false, parentId?: string) => {
    // In a real app, you would send this to your API
    if (isReply && parentId) {
      const updatedComments = comments.map((comment) => {
        if (comment.id === parentId) {
          const updatedReplies = comment.replies?.map((reply) => {
            if (reply.id === commentId) {
              return { ...reply, likes: reply.likes + 1 }
            }
            return reply
          })
          return { ...comment, replies: updatedReplies }
        }
        return comment
      })
      setComments(updatedComments)
    } else {
      const updatedComments = comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, likes: comment.likes + 1 }
        }
        return comment
      })
      setComments(updatedComments)
    }
  }

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    } else {
      return b.likes - a.likes
    }
  })

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>
      <CommentForm onSubmit={addComment} />
      <CommentList
        comments={sortedComments}
        onReply={addReply}
        onLike={likeComment}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
    </div>
  )
}

