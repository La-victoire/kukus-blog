import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Heart, MessageCircle, Share2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { cn } from "@/lib/utils"

interface posts {
  title : string,
  categories : string,
  date: string,
  author: string,
  description: string,
  _id : number,
  likes: number,
  comments: string,
  _createdAt: any,
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

  return (
    <>
        {posts && ( 
          posts.map((post, index) => (
              <Card 
                  key={posts._id} 
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
                      src={ "/project_pics/abstract-5719221.jpg"}
                      alt={posts.title}
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
                        {posts.categories}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 bg-white dark:bg-gray-950">
                    <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
                      <span>{posts._createdAt}</span>
                      <span>10 mins</span>
                    </div>
                    <Link href={`/blog/${posts._id}`}>
                      <h3 className={cn(
                        "font-bold mb-2 group-hover:text-primary transition-colors",
                        index === 0 ? "text-2xl" : "text-xl"
                      )}>
                        {posts.title}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{posts.description}</p>
                    <div className="flex items-center justify-between">
                      <Link href={`/blog/${posts._id}`} className="text-primary font-medium group-hover:underline">
                        Read more
                      </Link>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                          <Heart className="h-4 w-4" />
                          <span className="text-sm">{posts.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-sm">{posts.comments}</span>
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
