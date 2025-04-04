"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Pencil, Plus } from "lucide-react"
import Link from "next/link"
import useSWR from "swr"
import { getUser, postAdminSession } from "@/utils/userApi"
import { useParams } from "next/navigation"
import { getData } from "@/utils/api"

// Mock user data
const user = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  bio: "Senior Web Developer with 10+ years of experience in building modern web applications.",
  avatar: "/placeholder.svg?height=200&width=200",
  joinedDate: "March 2023",
}

// Mock blog posts
const userPosts = [
  {
    id: "1",
    title: "The Future of Web Development",
    excerpt: "Exploring upcoming trends and technologies in web development",
    publishedAt: "March 14, 2025",
    coverImage: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "2",
    title: "Mastering React Hooks",
    excerpt: "A comprehensive guide to using React Hooks effectively",
    publishedAt: "March 10, 2025",
    coverImage: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "3",
    title: "Building Accessible Web Applications",
    excerpt: "Best practices for creating inclusive web experiences",
    publishedAt: "March 5, 2025",
    coverImage: "/placeholder.svg?height=400&width=600",
  },
]

const fetcher = (url: string) => getUser<any>(url);
const dataFetcher = (url: string) => getData<any>(url);

export default function ProfilePage () {
  const params = useParams();
  const id = params.id;
  const { data:users, error:userError, isLoading:userLoading } = useSWR(id,fetcher);
  const { data:posts, error:postError, isLoading:postsLoading } = useSWR("/view", dataFetcher);
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    bio: user.bio,
  })
  const postUser = posts?.filter((item:any)=>(
    item?.user?._id === id
  ))
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send this data to your backend
    setIsEditing(false)
  }
  const properDate = (date:any) => {
    return new Date(date).toLocaleDateString("en-US", { month: "short",
      day:"2-digit",
      year:"numeric"
    });
  };
  

  return (
    <>
    <div className="container max-w-5xl py-12">
      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        {/* Profile sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={users?.profile_img} alt="Author Img"/>
                    <AvatarFallback>{users?.firstname?.charAt(0) || users?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
                <h2 className="mt-4 text-xl font-bold">{users?.firstname || users?.name }</h2>
                <p className="text-sm text-muted-foreground">Member since {properDate(users?.createdAt)}</p>
                <div className="mt-6 w-full">
                  <Link href="/post/create">
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Blog
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="space-y-6">
        <Link href="/">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home Page
            </Button>
          </Link>
          <Tabs defaultValue="posts">
            <TabsList>
              <TabsTrigger value="posts">My Posts</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            {/* Posts tab */}
            <TabsContent value="posts" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">My Blog Posts</h2>
              </div>

              {postUser?.length > 0 ? (
                <div className="grid gap-6">
                  {postUser?.map((post:any) => (
                    <Card key={post._id}>
                      <div className="flex flex-col md:flex-row">
                        <div className="relative h-48 md:h-auto md:w-48 shrink-0">
                          <img
                            src={post.coverImage || "/project_pics/abstract-5719221.jpg"}
                            alt={post.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <CardContent className="flex-1 p-6">
                          <Link href={`/blog/${post.id}`}>
                            <h3 className="text-xl font-bold hover:text-primary">{post.title}</h3>
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">{post.publishedAt}</p>
                          <p className="mt-2">{post.description}</p>
                          <div className="mt-4 flex gap-2">
                            <Link href={`/post/edit/${post._id}`}>
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                            </Link>
                            <Button variant="outline" size="sm" className="text-destructive">
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground mb-4">You haven't created any blog posts yet.</p>
                    <Link href="/create-blog">
                      <Button>Create Your First Post</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Profile tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your profile details</CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={users?.firstname}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={users?.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          rows={4}
                          value={users?.bio || ""}
                          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit">Save Changes</Button>
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-[120px_1fr] gap-2">
                        <div className="font-medium">Name:</div>
                        <div>{users?.name || users?.firstname}</div>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] gap-2">
                        <div className="font-medium">Email:</div>
                        <div>{users?.email}</div>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] gap-2">
                        <div className="font-medium">Bio:</div>
                        <div>{users?.bio || ""}</div>
                      </div>
                      <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
    </>
  )
}

