"use client"
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import Link from "next/link"
import { ArrowRight, Menu, Search, X } from 'lucide-react'
import { motion } from "framer-motion"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSession, signIn, signOut } from "next-auth/react"

 const highLight = ' flex h-[40px] px-3 items-center bg-gray-900 rounded-3xl transition-all'

const Navbar = () => {
  const [isPrevious, setIsPrevious] = useState(1)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>()
  const [Oauth, setOauth] = useState<any>()
  const headerRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  
  useEffect(()=> {
    const store = sessionStorage.getItem("user")
    setUser(store ? JSON.parse(store) : null)
    if (status === "authenticated") {
      try {
        const getCookie = async () => {
          const res = await fetch("/api/set-cookie",{credentials: "include"})
          if (!res.ok) {
            console.error(Error)
          }
          const data = res.json()
          console.log("Cookie set :", data)
        }

        getCookie()
      } catch (error) {
        console.error(error)        
      }
      sessionStorage.setItem("OauthUser", JSON.stringify({name:session?.user?.name ,image:session?.user?.image, id:session?.user?.id}))
    }
    setOauth(sessionStorage.getItem('OauthUser'))

  },[])

  const handleActive = (key:number) => {
    setIsPrevious(key) 
  }
  const firstName = (name:string | null | undefined) => {
    if (name?.includes(' ')) {
    const [firstname, lastname] = name?.split(' ')
    return firstname
    } else {
      return name
    }
  }

  return (
    <>
    <div className='items-center z-0 text-foreground'>

          {/* Full-width header with navigation */}
          <header 
        ref={headerRef}
        className="relative h-screen max-h-[800px] w-full overflow-hidden"
      >
      <div className='flex z-20 absolute text-white items-center top-5 w-full gap-5 justify-between px-10'>
        <div>
          <img src="/K_20250309_145243_0000.png" alt="logo" 
          className='w-14 h-auto rounded-full'
          />
        </div>
        <div className='hidden md:flex w-[50dvw] h-[10dvh] rounded-4xl mx-10 gap-5 bg-black justify-center items-center px-5'>
          <div>  
          <Menu className="h-6 w-6" />             
            </div>
          <div className='flex hover:cursor-default active:cursor-pointer justify-center items-center gap-5'> 
           {[ {name:'HOME', id:0},{name:'FEATURED',id:1},{name:'LATEST',id:2},{name:'CONTACT',id:3} ].map((item, index:number)=>(
            <p key={item.id} className={`${ isPrevious === item.id ? `${highLight}` : "bg-transparent " }`} onClick={()=> handleActive(item.id)}>
              <Link href={`#${item.name.toLowerCase() }`}>
              {item.name}
              </Link>
            </p>
           ))}
          </div>

        </div>
        <div>
          {user || status === "authenticated" ? (
            <Link href={`/profile/${user?.id || Oauth?.id}`} className="flex flex-row gap-5 justify-center items-center ">
            <p>
              Welcome {user?.name || firstName(session?.user?.name) }
            </p>
            <Avatar className='hidden md:flex'>
              <AvatarImage src={  Array.isArray(user?.image) && user?.image.map((i)=> i.value) || session?.user?.image } alt={session?.user?.name || user?.name} />
              <AvatarFallback>{user?.name?.charAt(0) || session?.user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            </Link>
          ) : (
        <Link href="/profile/sign-in">
         <button className='cursor-pointer'>
          SIGN UP
          </button> 
        </Link>
          )}
        </div>
        <div>
        <button 
                className="md:hidden text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
        </div>
      </div>
        <div 
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src="/project_pics/kevin-laminto-HxCl2w7pKy0-unsplash.jpg"
            alt="Header background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-[72px] left-0 right-0 bg-black/95 border-b border-white/10 z-50">
              <div className="container mx-auto px-4 py-4">
                <nav className="flex flex-col space-y-4 mb-6">
                  <Link 
                    href="/" 
                    className="text-white hover:text-primary transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    href="/post" 
                    className="text-white hover:text-primary transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Blog
                  </Link>
                  <Link 
                    href="#about" 
                    className="text-white hover:text-primary transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link 
                    href="#contact" 
                    className="text-white hover:text-primary transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </nav>
                <div className="flex flex-col space-y-4">
                  <div className="flex space-x-4">
                    {user || session ? (
                    <>
                      <Link href="/post/create" className="flex-1">
                        <Button className="w-full">Get Started</Button>
                      </Link>
                      <div className='flex-1'>
                      <Button variant="outline" className='w-full  border-white text-black hover:bg-transparent hover:text-white' onClick={()=> signOut()} >
                      LogOut
                      </Button>
                      </div>
                    </>
                    ) : (
                    <Link href="/sign-in" className="flex-1">
                      <Button variant="outline" className="w-full border-white text-black hover:bg-transparent hover:text-white">
                        Sign In
                      </Button>
                    </Link>
                    )
                    }
                  </div>
                </div>
              </div>
            </div>
          )}
        
        <div className="relative z-10 h-full flex text-white items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                Discover Stories That <span className="text-orange-300">Inspire</span>
              </h1>
              <p className="text-xl  mb-8">
                Explore thought-provoking articles on topics that matter. Join our community of curious minds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={`/post`}>
                  <Button size="lg" className="w-full sm:w-auto">
                    Explore Articles
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/post/create">
                  <Button size="lg" variant="outline" className={`w-full sm:w-auto ${user || session ? "flex" : "hidden" } border-white text-primary hover:bg-transparent hover:text-white`}>
                    Start Writing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>


        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-1 h-3 bg-white rounded-full animate-pulse" />
          </div>
        </div>
      </header>
           {/* Hero Content */}


    </div>


    </>
  )
}

export default Navbar