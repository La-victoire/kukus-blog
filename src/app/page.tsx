"use client"

import useSWR from "swr";
import { getData } from "../utils/api"; // Import our API helper
import Hero from "./components/Hero";
import Trending from "./components/Trending";
import { getUser } from "@/utils/userApi";
import { BlogCard } from "./components/BlogCard";
import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ArrowRight, ChevronRight, Heart, MessageCircle, Share2, Search, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOnsiX2lkIjoiNjdjOTE1NWEwMjE1YzYxZGM0ZjZlYjEzIiwibmFtZSI6IlZpY3RvcnkiLCJlbWFpbCI6InZpY3RvcnlvZ2h1dmJ1QGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJHRtLkpncmY5bkNtMmxYWWVCRVZkaHUwNWlmLmdyaUNOaGVUSXV6QkN3aDRkb0dkN2d6b1o2Iiwicm9sZSI6ImFkbWluIiwiY3JlYXRlZEF0IjoiMjAyNS0wMy0wNlQwMzoyNDoxMC4wMjZaIiwidXBkYXRlZEF0IjoiMjAyNS0wMy0wNlQwMzoyNDoxMC4wMjZaIiwiX192IjowfSwiaWF0IjoxNzQxOTMxMDg4LCJleHAiOjE3NDIwMTc0ODh9.ODJYWrxsKHJoFn2tZVKkVSEzo11dvtjJe5l5kltBbJA"
const fetcher = (url: string) => getData<any>(url);
// const userFetcher = (url:string , token: string) => getUser<any>(url, token)

// const searcher = (url: string) => getData<any>(url);

const DataComponent = () => { 
  const [image, setImage] = useState();
  const [search, setSearch] = useState();
  const [value, setValue] = useState("");
  const [isQuery, setIsQuery] = useState(false);
  const { data:posts, error:postError, isLoading:postsLoading } = useSWR("/view", fetcher);
  // const { data:users, error:userError, isLoading:userLoading } = useSWR( token ? ["/", token] : null, userFetcher);

  
  const handleSearch = async ()=> {
    if (value === "") {
      const searchData = await getData(`/search/my`)
      setIsQuery(false)
    } else {
      const searchData = await getData(`/search/${value}`)
      const searchTitle = searchData.filter((data)=> data.title)
      setSearch(searchTitle);
      setValue(value);
      console.log(search)
      setIsQuery(true);
    }
  }
  const cancelSearch = () => {
    setValue("");
    setIsQuery(false);
  }

  
  // const matchUser = (userId) => {
  //  const filter = users.filter((user:any)=> user._id === userId).map((name:any) => name.name);
  //   return filter
  //   }

  const handleChange = async (e:any)=> {
    const value = e.target.value; 
    setValue(value);
  }

  if (postsLoading) return <p>Loading...</p>;
  if (postError) return <p>Error loading data</p>;

  return (
    <>
    

    <Hero />
    <br />
    <div className=" pl-10">
      <p className="text-lg font-bold">Search Blogs</p>
    <div className="relative flex">
        <Search onClick={handleSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          onChange={handleChange}
          value={value}
          placeholder="Search Blog..." 
          className="pl-10 bg-white/10 border-white/20 text-black placeholder:text-white/50 w-[200px] focus:w-[300px] transition-all duration-300"
        />
        <div className="justify-center items-center text-muted-foreground ml-3 flex">
        <X onClick={cancelSearch} className="h-4 w-4" />
        </div>
    </div>
      <div>
        {isQuery && (<div>
          {search.map((query:any) => (
            <li key={query._id} className="flex flex-col justify-center items-center gap-y-5 text-xl text-center px-4 py-2 rounded-full  ">
              <Link href={`/post/${query._id}`}>
              {query.title} 
              </Link>
              
            </li>
          ))}
        </div>)}
      </div>
    </div>

    <main className="min-h-screen">

      {/* Latest Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Latest Articles</h2>
              <p className="text-muted-foreground max-w-2xl">
                Stay up to date with our newest publications across various categories.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              {posts.slice(0, 5).map((post:any) => (
                <Link href={`/category/${post.categories.toLowerCase()}`} key={post._id}>
                  <Badge variant="outline" className="hover:bg-primary/10 transition-colors">
                    {post.categories}
                  </Badge>
                </Link>
              ))}
              <Link href="/categories">
                <Badge variant="outline" className="hover:bg-primary/10 transition-colors">
                  More...
                </Badge>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BlogCard posts={posts} key={posts._id}/>
          </div>

          <div className="mt-12 text-center">
            <Link href="/blog">
              <Button size="lg" variant="outline">
                Load More Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Inspired</h2>
            <p className="text-muted-foreground mb-8">
              Join our newsletter and get the latest articles delivered directly to your inbox. 
              No spam, just the content you love.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <Input 
                placeholder="Your email address" 
                type="email"
                className="flex-grow"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </section>



      {/* Quote Section */}
      <section className="py-16 bg-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <svg 
              className="w-12 h-12 mx-auto mb-6 text-primary/50" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-2xl italic mb-6">
              "The beautiful thing about learning is that no one can take it away from you. Knowledge is the pathway to freedom."
            </p>
            <div className="flex items-center justify-center">
              <div className="h-px bg-primary/20 flex-grow max-w-[100px]" />
              <span className="px-4 font-medium">B.B. King</span>
              <div className="h-px bg-primary/20 flex-grow max-w-[100px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link href="/profile" className="text-white text-2xl font-bold mb-4 inline-block">
                <img src="/K_20250309_145243_0000.png" alt="logo" className="w-64 h-auto" />
              </Link>
              <p className="text-white/70 mb-6">
                Exploring ideas that shape our world through thoughtful and engaging content.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white/70 hover:text-primary transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-white/70 hover:text-primary transition-colors">
                s
                </a>
              </div>
        </div>
        </div>
        </div>
      </footer>
    </main>
    </>
  )
}

export default DataComponent;
