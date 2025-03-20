"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { ArrowLeft, ImageIcon, Loader2 } from "lucide-react"
import Link from "next/link"

export default function CreateBlogPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload this to a server and get a URL back
      // For this example, we'll use a placeholder
      setCoverImage("/placeholder.svg?height=800&width=1600")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      // Redirect to the blog post (in a real app, you would redirect to the newly created post)
      router.push("/blog/1")
    }, 1500)
  }

  return (
    <div className="container max-w-4xl py-12">
      <Link href="/profile">
        <Button variant="ghost" size="sm" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to profile
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create New Blog Post</CardTitle>
          <CardDescription>Share your thoughts and ideas with the world</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Cover image upload */}
            <div className="space-y-2">
              <Label htmlFor="cover-image">Cover Image</Label>
              <div
                className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => document.getElementById("cover-image")?.click()}
              >
                {coverImage ? (
                  <div className="relative aspect-video w-full overflow-hidden rounded-md">
                    <img
                      src={coverImage || "/placeholder.svg"}
                      alt="Cover preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mb-2" />
                    <p className="text-sm">Click to upload a cover image</p>
                    <p className="text-xs">Recommended size: 1600 x 800 pixels</p>
                  </div>
                )}
                <Input id="cover-image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter your blog title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your blog content here..."
                rows={15}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Tip: You can use Markdown formatting for headings, lists, and more.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/profile")}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" type="button">
                Save as Draft
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish Post"
                )}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

