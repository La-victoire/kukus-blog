"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Calendar, Clock } from "lucide-react"

// Sample blog posts data
const allPosts = [
  {
    id: "1",
    title: "The Art of Mindful Living: Finding Peace in a Busy World",
    excerpt:
      "Discover practical techniques to incorporate mindfulness into your daily routine and transform your life.",
    category: "Lifestyle",
    coverImage: "/placeholder.svg?height=600&width=800",
    publishedAt: "March 15, 2025",
    readTime: "8 min read",
    author: {
      name: "Emma Wilson",
      image: "/placeholder.svg?height=100&width=100",
    },
    featured: true,
  },
  {
    id: "2",
    title: "Sustainable Travel: Exploring the World Responsibly",
    excerpt: "Learn how to minimize your environmental impact while experiencing the beauty of global destinations.",
    category: "Travel",
    coverImage: "/placeholder.svg?height=600&width=800",
    publishedAt: "March 12, 2025",
    readTime: "10 min read",
    author: {
      name: "Michael Chen",
      image: "/placeholder.svg?height=100&width=100",
    },
    featured: true,
  },
  {
    id: "3",
    title: "The Future of Remote Work: Trends and Predictions",
    excerpt: "Explore how remote work is evolving and what to expect in the coming years for distributed teams.",
    category: "Business",
    coverImage: "/placeholder.svg?height=600&width=800",
    publishedAt: "March 10, 2025",
    readTime: "12 min read",
    author: {
      name: "Sarah Johnson",
      image: "/placeholder.svg?height=100&width=100",
    },
    featured: false,
  },
  {
    id: "4",
    title: "Plant-Based Cooking: Simple Recipes for Beginners",
    excerpt: "Start your plant-based journey with these easy and delicious recipes that anyone can make.",
    category: "Food",
    coverImage: "/placeholder.svg?height=600&width=800",
    publishedAt: "March 8, 2025",
    readTime: "6 min read",
    author: {
      name: "David Rodriguez",
      image: "/placeholder.svg?height=100&width=100",
    },
    featured: false,
  },
  {
    id: "5",
    title: "Digital Minimalism: Reclaiming Focus in a Noisy World",
    excerpt: "How to reduce digital clutter and create healthier technology habits for improved wellbeing.",
    category: "Technology",
    coverImage: "/placeholder.svg?height=600&width=800",
    publishedAt: "March 5, 2025",
    readTime: "9 min read",
    author: {
      name: "Alex Thompson",
      image: "/placeholder.svg?height=100&width=100",
    },
    featured: false,
  },
  {
    id: "6",
    title: "The Science of Sleep: Why Quality Rest Matters",
    excerpt: "Understanding the crucial role of sleep in physical health, mental clarity, and emotional wellbeing.",
    category: "Health",
    coverImage: "/placeholder.svg?height=600&width=800",
    publishedAt: "March 3, 2025",
    readTime: "7 min read",
    author: {
      name: "Jessica Lee",
      image: "/placeholder.svg?height=100&width=100",
    },
    featured: false,
  },
  {
    id: "7",
    title: "Financial Freedom: Building Wealth on Any Income",
    excerpt: "Practical strategies for saving, investing, and growing your wealth regardless of your starting point.",
    category: "Finance",
    coverImage: "/placeholder.svg?height=600&width=800",
    publishedAt: "March 1, 2025",
    readTime: "11 min read",
    author: {
      name: "Robert Kim",
      image: "/placeholder.svg?height=100&width=100",
    },
    featured: false,
  },
  {
    id: "8",
    title: "Creative Writing: Finding Your Unique Voice",
    excerpt: "Techniques and exercises to develop your writing style and express your authentic perspective.",
    category: "Arts",
    coverImage: "/placeholder.svg?height=600&width=800",
    publishedAt: "February 28, 2025",
    readTime: "8 min read",
    author: {
      name: "Olivia Martinez",
      image: "/placeholder.svg?height=100&width=100",
    },
    featured: false,
  },
  {
    id: "9",
    title: "Ethical Fashion: The Rise of Sustainable Style",
    excerpt: "How the fashion industry is transforming to address environmental and social concerns.",
    category: "Fashion",
    coverImage: "/placeholder.svg?height=600&width=800",
    publishedAt: "February 25, 2025",
    readTime: "9 min read",
    author: {
      name: "Sophia Wang",
      image: "/placeholder.svg?height=100&width=100",
    },
    featured: false,
  },
]

// Categories
const categories = [
  "All Categories",
  "Lifestyle",
  "Travel",
  "Business",
  "Food",
  "Technology",
  "Health",
  "Finance",
  "Arts",
  "Fashion",
]

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [sortBy, setSortBy] = useState("newest")

  // Filter and sort posts
  const filteredPosts = allPosts
    .filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All Categories" || post.category === selectedCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      } else if (sortBy === "oldest") {
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      } else if (sortBy === "readTime") {
        return Number.parseInt(b.readTime) - Number.parseInt(a.readTime)
      }
      return 0
    })

  return (
    <main className="min-h-screen pb-16">
      {/* Header */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Explore our collection of articles covering a wide range of topics from lifestyle to technology.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search articles..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter by:</span>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="readTime">Read Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {filteredPosts.length} of {allPosts.length} articles
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden group h-full transition-all duration-300 hover:shadow-lg">
                <div className="relative h-56">
                  <Image
                    src={post.coverImage || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {post.featured && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-primary hover:bg-primary/90">Featured</Badge>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 z-10">
                    <Badge variant="outline" className="bg-white/80 hover:bg-white">
                      {post.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{post.publishedAt}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <Link href={`/blog/${post.id}`}>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                  </Link>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={post.author.image} alt={post.author.name} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{post.author.name}</span>
                    </div>
                    <Link href={`/blog/${post.id}`}>
                      <Button variant="ghost" size="sm" className="text-primary">
                        Read More
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("All Categories")
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}

          {filteredPosts.length > 0 && (
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg">
                Load More
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

