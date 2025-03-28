"use client"

import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { getData } from "@/utils/api"
import { useParams } from "next/navigation"
import useSWR from "swr"
import { CommentSection } from "@/app/components/comments/comment-section"

// const getBlogPost = () => {

//   return {
//     id,
//     title: "The Future of Web Development",
//     coverImage: "/placeholder.svg?height=800&width=1600",
//     content: `
//       <p>The landscape of web development is constantly evolving, with new technologies and methodologies emerging at a rapid pace. As we look to the future, several trends are poised to reshape how we build and interact with web applications.</p>
      
//       <h2>The Rise of AI-Assisted Development</h2>
//       <p>Artificial intelligence is increasingly becoming an integral part of the development process. From code completion to automated testing, AI tools are enhancing developer productivity and enabling more sophisticated applications with less manual effort.</p>
      
//       <p>These AI assistants can now generate entire components, suggest optimizations, and even help debug complex issues. As these tools continue to evolve, we can expect them to become even more sophisticated, potentially handling larger portions of the development process.</p>
      
//       <h2>WebAssembly: Breaking Performance Barriers</h2>
//       <p>WebAssembly (Wasm) is revolutionizing what's possible in browser-based applications. By allowing code written in languages like C++, Rust, and Go to run in the browser at near-native speed, Wasm is enabling web applications to perform tasks that were previously only possible in desktop applications.</p>
      
//       <p>From complex data visualizations to in-browser video editing, WebAssembly is expanding the horizons of what can be accomplished on the web. As more languages add WebAssembly support and the ecosystem matures, we can expect to see increasingly powerful web applications that rival their desktop counterparts.</p>
      
//       <h2>The Serverless Evolution</h2>
//       <p>Serverless architectures continue to gain traction, offering developers a way to build and deploy applications without managing infrastructure. This approach not only simplifies deployment but also provides automatic scaling and can reduce operational costs.</p>
      
//       <p>As serverless platforms mature, we're seeing more sophisticated offerings that address previous limitations around cold starts, long-running processes, and state management. This evolution is making serverless a viable option for an increasingly broad range of applications.</p>
      
//       <h2>Conclusion</h2>
//       <p>The future of web development is bright, with technologies like AI, WebAssembly, and serverless computing pushing the boundaries of what's possible. By staying informed about these trends and embracing new tools and methodologies, developers can create more powerful, efficient, and user-friendly web applications.</p>
//     `,
//     publishedAt: "March 14, 2025",
//     readTime: "8 min read",
//     author: {
//       name: "Alex Johnson",
//       image: "/placeholder.svg?height=100&width=100",
//       bio: "Senior Web Developer with 10+ years of experience in building modern web applications.",
//     },
//   }
// }

export default function BlogPost() {

  const params = useParams();
  const id = params.id;
  const dataFetcher = (url: string) => getData<any>(url);
  const { data:posts, error:postError, isLoading:postsLoading } = useSWR(id, dataFetcher);

  const properDate = (date:any) => {
    return new Date(date).toLocaleDateString("en-US", { month: "short",
      day:"2-digit",
      year:"numeric"
    });
  };

  return (
    <main className="min-h-screen pb-16">
      {/* Cover image with title overlay */}
      <div className="relative h-[50vh] w-full">
        <Image src={"/project_pics/abstract-5719221.jpg"} alt={posts?.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="container max-w-4xl px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{posts?.title}</h1>
            <div className="flex items-center justify-center gap-4 text-white/80">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{properDate(posts?.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{posts?.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog content */}
      <div className="container max-w-4xl px-4 mx-auto -mt-16 relative">
        <div className="bg-background rounded-lg shadow-lg p-6 md:p-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to all posts
            </Button>
          </Link>

          {/* Author info */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b">
            <Avatar className="h-12 w-12">
              <AvatarImage src={posts?.user?.profile_img} alt={"author image"} />
              <AvatarFallback>{posts?.user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{posts?.user?.name}</h3>
              <p className="text-sm text-muted-foreground">{posts?.user?.bio}</p>
            </div>
          </div>

          {/* Blog content */}
          <article className="prose prose-gray dark:prose-invert max-w-none">
            {posts?.content?.map((text:any)=> (
            <div key={text._id}
            dangerouslySetInnerHTML={{ __html:text.value }} />
            ))}
          </article>

          <div className="mt-12 border-t">
            <CommentSection postId={posts._id} initialComments={sampleComments} />
          </div>
        </div>
      </div>
    </main>
  )
}

