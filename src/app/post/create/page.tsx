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
import { postData } from "@/utils/api"
import { Toaster } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TextEditor } from "@/app/components/editor/Text-editor"
import { EditorPreview } from "@/app/components/editor/editor-preview"

const initialContent = `
<h1>Welcome to KuKu's Modern Text Editor</h1>
<ul>
  <li>Text formatting (bold, italic, underline)</li>
  <li>Headings and alignment</li>
  <li>Lists (ordered and unordered)</li>
  <li>Links and images</li>
  <li>And more!</li>
</ul>`

export default function CreateBlogPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [preview, setPreview] = useState<any | null>(null)
  const [coverImg, setCoverImg] = useState<any | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description:"",
    categories:"",
    content: initialContent,
    coverImage: coverImg 
  })

  const formInfo = new FormData();

  formInfo.append( "title",formData.title)
  formInfo.append("description" ,formData.description)
  formInfo.append("categories",formData.categories)
  formInfo.append( "content",formData.content)
  formInfo.append( "coverImage",formData.coverImage)


  const handleRawFiles = (file:File) => {
    setFormData({...formData, content:file})
    console.log("GOT THEM FILES:", formData?.content)
  }
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload this to a server and get a URL back
      // For this example, we'll use a placeholder
      console.log(file)
      setFormData((prev) => ({ ...prev, coverImage:file,}))
      setPreview(URL.createObjectURL(file))
      console.log(formData)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      console.log(formData)
      const data:any = await postData("/create",formInfo)
      console.log(data)
      const userId = data.user
       if (userId) {
         router.push(`/post/${userId}`)
       }
      setIsSubmitting(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="container max-w-4xl py-12">
      <Link href="/">
        <Button variant="ghost" size="sm" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
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
                {preview ? (
                  <div className="relative aspect-video w-full overflow-hidden rounded-md">
                    <img
                      src={preview || "/placeholder.svg"}
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

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Describe what your post is about"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categories">Category</Label>
              <Input
                id="categories"
                placeholder="Tech, Photography ..."
                value={formData.categories}
                onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
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
              <div className="container py-12 max-w-4xl">
                <Toaster />
                <h1 className="text-3xl font-bold mb-2">Modern Text Editor</h1>
                <p className="text-muted-foreground mb-8">A rich text editor with image upload capabilities</p>

                <Tabs defaultValue="edit">
                  <TabsList className="mb-4">
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="both">Split View</TabsTrigger>
                  </TabsList>

                  <TabsContent value="edit">
                    <Card>
                      <CardHeader>
                        <CardTitle>Editor</CardTitle>
                        <CardDescription>Use the toolbar to format text and add media</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <TextEditor onRawFilesChange={handleRawFiles} initialValue={formData.content} onChange={(content)=> setFormData({...formData, content:content})} minHeight="400px" />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="preview">
                    <Card>
                      <CardHeader>
                        <CardTitle>Preview</CardTitle>
                        <CardDescription>See how your content will appear</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="border rounded-md p-6 min-h-[400px]">
                          <EditorPreview content={formData.content} />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="both">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Editor</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <TextEditor onRawFilesChange={handleRawFiles} initialValue={formData.content} onChange={(content)=> setFormData({...formData, content:content})} minHeight="500px" />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="border rounded-md p-6 min-h-[500px] overflow-auto">
                            <EditorPreview content={formData.content} />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>

              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/")}>
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

