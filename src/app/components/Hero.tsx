import React from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
const Hero = () => {
  const [isMounted, setIsMounted] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  useEffect(() => {
    setIsMounted(true)
    const interval = setInterval(()=> {
      setCurrentSlide((prev)=> (prev + 1)% totalSlides)
    }, 3000)

    return ()=> clearInterval(interval);
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>

<section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Stories</h2>
              <p className="text-muted-foreground max-w-2xl">
                Handpicked articles that showcase the depth and diversity of our writers' perspectives.
              </p>
            </div>
            <Link href="/blog" className="mt-4 md:mt-0 group flex items-center text-primary font-medium">
              View all articles
              <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <Carousel className="w-full">
            <CarouselContent>
              {[0,1,2].map((post) => (
                <CarouselItem key={post} className="md:basis-1/2 lg:basis-1/3 h-[500px]">
                  <div className="h-full p-1">
                    <div className="relative h-full overflow-hidden rounded-xl group">
                      <Image
                        src={`/project_pics/Trend-${post + 1 }.jpg` || "/placeholder.svg"}
                        alt="image"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                      
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-primary hover:bg-primary/90">
                          blog feature
                        </Badge>
                      </div>
                      
                      <div className="absolute bottom-0 left-0 p-6 w-full">
                        <Link href={`/blog/${post}`}>
                          <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                          {post === 0 && (
                            <p key={'51'} className='Mila'>TRENDING TOPICS </p>
                          )}
                          {post === 2 && (
                            <p key={'71'} className='BIKAVE'>TECHNOLOGICAL FACTS</p>
                          )}
                          {post === 1 && (
                            <p key={'81'} className='aikonig_italic'>PHOTOGRAPHY TIPS</p>
                          )}
                          </h3>
                        </Link>
                        <p className="text-white/80 mb-4 line-clamp-2">The best in :</p>
                      
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8 gap-2">
              <CarouselPrevious className="relative inset-0 translate-y-0 h-10 w-10" />
              <CarouselNext className="relative inset-0 translate-y-0 h-10 w-10" />
            </div>
          </Carousel>
        </div>
      </section>

    </>
  )
}

export default Hero