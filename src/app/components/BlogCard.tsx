import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Heart, MessageCircle, Share2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface posts {
  title : string,
  categories : string,
  date: string,
  author: string,
  description: string,
  _id : number,
  likes: number,
  comments: any,
  createdAt: any,
  coverImage: any,
}

interface blogCardPost {
  posts : posts
}
export const BlogCard = ({posts} : blogCardPost) => {

  const properDate = (date:any) => {
    return new Date(date).toLocaleDateString("en-US", { month: "short",
      day:"2-digit",
      year:"numeric"
    });
  };
console.log(posts._id)
console.log(posts?.map((post)=>post?.user?.name || post?.user?.firstname))
  return (
    <>
        {Array.isArray(posts) && ( posts?.map((post:posts, index:any) => (
              <Card 
                  key={post._id} 
                  className={cn(
                    "overflow-hidden group h-full transition-all duration-300 hover:shadow-lg border-none",
                    index === 0 && "md:col-span-2 md:row-span-2"
                  )}
                >
                  <div className={cn(
                    "relative",
                    index === 0 ? "h-80" : "h-56"
                  )}>
                    <Image
                      src={ post?.coverImage?.map((img)=> (img?.value)).join('') || "/project_pics/abstract-5719221.jpg"}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 z-10">
                      <Badge 
                        className="bg-primary hover:bg-primary/90 shadow-lg"
                        style={{
                          animation: `pulse 2s infinite ${index * 0.2}s`
                        }}
                      >
                        {post.categories}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 bg-white dark:bg-gray-950">
                        <div className="flex items-center justify-between -mt-8">
                          <Avatar>
                            <AvatarImage src={post?.user?.profile_img?.map((i)=> i.value)} alt={post?.user?.name} />
                            <AvatarFallback>{post?.user?.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-muted-foreground">{post?.user?.username || post?.user?.name || post?.user?.firstname }</span>
                        </div>
                    <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
                      <span>{properDate(post.createdAt)}</span>
                      <span>10 mins</span>
                    </div>
                    <Link href={`/blog/${post._id}`}>
                      <h3 className={cn(
                        "font-bold mb-2 group-hover:text-primary transition-colors",
                        index === 0 ? "text-2xl" : "text-xl"
                      )}>
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{post.description}</p>
                    <div className="flex items-center justify-between">
                      <Link href={`/post/${post._id}`} className="text-primary font-medium group-hover:underline">
                        Read more
                      </Link>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                          <Heart className="h-4 w-4" />
                          <span className="text-sm">{post?.likes || 0}</span>
                        </button>
                        <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-sm">{0}</span>
                        </button>
                        <button className="text-muted-foreground hover:text-primary transition-colors">
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
        )
    ))}
    </>
  )
}
