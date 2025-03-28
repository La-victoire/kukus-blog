"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, X, Loader2, ImageIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { DeletePostDialog } from "@/components/blog/delete-post-dialog"

// Sample post data
const getPostData = (id: string) => {
  return {
    id,
    title: "The Future of Web Development",
    content: `The landscape of web development is constantly evolving, with new technologies and methodologies emerging at a rapid pace. As we look to the future, several trends are poised to reshape how we build and interact with web applications.

## The Rise of AI-Assisted Development

Artificial intelligence is increasingly becoming an integral part of the development process. From code completion to automated testing, AI tools are enhancing developer productivity and enabling more sophisticated applications with less manual effort.

These AI assistants can now generate entire components, suggest optimizations, and even help debug complex issues. As these tools continue to evolve, we can expect them to become even more sophisticated, potentially handling larger portions of the development process.

## WebAssembly: Breaking Performance Barriers

WebAssembly (Wasm) is revolutionizing what's possible in browser-based applications. By allowing code written in languages like C++, Rust, and Go to run in the browser at near-native speed, Wasm is enabling web applications to perform tasks that were previously only possible in desktop applications.

From complex data visualizations to in-browser video editing, WebAssembly is expanding the horizons of what can be accomplished on the web. As more languages add WebAssembly support and the ecosystem matures, we can expect to see increasingly powerful web applications that rival their desktop counterparts.

## The Serverless Evolution

Serverless architectures continue to gain traction, offering developers a way to build and deploy applications without managing infrastructure. This approach not only simplifies deployment but also provides automatic scaling and can reduce operational costs.

As serverless platforms mature, we're seeing more sophisticated offerings that address previous limitations around cold starts, long-running processes, and state management. This evolution is making serverless a viable option for an increasingly broad range of applications.`,
    excerpt: "Explore how remote work is evolving and what to expect in the coming years for distributed teams.",
    coverImage: "/placeholder.svg?height=800&width=1600",
    category: "Technology",
    tags: ["Web Development", "AI", "WebAssembly", "Serverless"],
    publishedAt: "2025-03-14T10:00:00Z",
    status: "published",
    featured: true,
    allowComments: true,
  }
}

// Sample categories
const categories = [
  "Technology",
  "Business",
  "Lifestyle",
  "Health",
  "Travel",
  "Food",
  "Finance",
  "Arts",
  "Fashion",
  "Science",
]

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [postData, setPostData] = useState(getPostData(params.id))
  const [tags, setTags] = useState<string[]>(postData.tags)
  const [newTag, setNewTag] = useState("")
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPostData({
      ...postData,
      [name]: value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setPostData({
      ...postData,
      [name]: value,
    })
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setPostData({
      ...postData,
      [name]: checked,
    })
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault()
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()])
      }
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent, action: "save" | "publish" | "draft") => {
    e.preventDefault()
    setIsSubmitting(true)

    const updatedPostData = {
      ...postData,
      tags,
      status: action === "publish" ? "published" : action === "draft" ? "draft" : postData.status,
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      router.push(`/blog/${params.id}`)
    }, 1500)
  }

  const handleDelete = () => {
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/blog")
    }, 1500)
  }

  return (
    <div className="container max-w-4xl py-12">
      <Link href={`/blog/${params.id}`}>
        <Button variant="ghost" size="sm" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to post
        </Button>
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Post</h1>
          <p className="text-muted-foreground">Update your blog post content and settings</p>
        </div>
        <div>
          <Button variant="destructive" onClick={handleDelete}>
            Delete Post
          </Button>
        </div>
      </div>

      <form>
        <div className="grid gap-6">
          {/* Cover Image */}
          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
              <CardDescription>Upload a high-quality image to represent your post</CardDescription>
            </CardHeader>
            <CardContent>
              {coverImagePreview || postData.coverImage ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-md">
                  <Image
                    src={coverImagePreview || postData.coverImage}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    type="button"
                    onClick={() => {
                      setCoverImagePreview(null)
                      setCoverImageFile(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => document.getElementById("cover-image")?.click()}
                >
                  <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mb-2" />
                    <p className="text-sm">Click to upload a cover image</p>
                    <p className="text-xs">Recommended size: 1600 x 800 pixels</p>
                  </div>
                </div>
              )}
              <input
                id="cover-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverImageChange}
              />
            </CardContent>
          </Card>

          {/* Post Details */}
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
              <CardDescription>Enter the title and content of your post</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={postData.title} onChange={handleInputChange} required />
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea id="excerpt" name="excerpt" value={postData.excerpt} onChange={handleInputChange} rows={2} />
                <p className="text-xs text-muted-foreground">
                  A brief summary of your post. This will be displayed in post previews.
                </p>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={postData.content}
                  onChange={handleInputChange}
                  rows={15}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  You can use Markdown formatting for headings, lists, links, and more.
                </p>
              </div>

              {/* Category and Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={postData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                  <Input
                    id="tags"
                    placeholder="Add a tag and press Enter"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleAddTag}
                  />
                  <p className="text-xs text-muted-foreground">
                    Press Enter to add a tag. Tags help readers discover your content.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Post Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Post Settings</CardTitle>
              <CardDescription>Configure additional settings for your post</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="featured">Featured Post</Label>
                  <p className="text-sm text-muted-foreground">
                    Feature this post on the homepage and in featured sections
                  </p>
                </div>
                <Switch
                  id="featured"
                  checked={postData.featured}
                  onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowComments">Allow Comments</Label>
                  <p className="text-sm text-muted-foreground">Let readers comment on this post</p>
                </div>
                <Switch
                  id="allowComments"
                  checked={postData.allowComments}
                  onCheckedChange={(checked) => handleSwitchChange("allowComments", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => router.push(`/blog/${params.id}`)}>
              Cancel
            </Button>
            <Button variant="outline" type="button" onClick={(e) => handleSubmit(e, "draft")} disabled={isSubmitting}>
              Save as Draft
            </Button>
            <Button type="button" onClick={(e) => handleSubmit(e, "save")} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </form>

      <DeletePostDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        isDeleting={isSubmitting}
        postTitle={postData.title}
      />
    </div>
  )
}

