"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { profile } from "@/utils/api"
import { userSchema } from "@/utils/verification"
import { useSession, signIn, signOut } from "next-auth/react"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassWord] = useState("");
  const [confirmPassWord, setConfirmPassWord] = useState("");
  const [info, setInfo] = useState({
    email, password, firstname, lastname,
  });
  const [error, setError] = useState({})


  // type SignupForm = {
  //   firstname?:string ,
  //   lastname?:string,
  //   email?:string,
  //   confirmPassWord?:string,
  // }

  // type SigninForm = {
  //   email?:string,
  //   password?:string
  // }
  
  // const fetcher = (url: string, data: SignupForm) => profile<any>(url,data);
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const enterProfile = {
        email,
        password
      }
      console.log(enterProfile)
      const data:any = await profile("/signin",enterProfile)
      console.log(data)
      const userId = data.existingUser._id
      const userName = data.existingUser.name || data.existingUser.firstname
      const userPic = data.existingUser.profile_img
      setIsLoading(false)
       if (userId) {
          sessionStorage.setItem("user", JSON.stringify({name:userName,image:userPic, id:userId}))
         router.push(`/profile/${userId}`)
       } else {
        location.reload()
       }
    } catch (error) {
      console.log(error)
    }
  }
  const formInfo = new FormData();
  formInfo.append( "firstname",info.firstname)
  formInfo.append("lastname" ,info.lastname)
  formInfo.append("password" ,info.password)
  formInfo.append("email" ,info.email)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const plainData = {
    firstname: formInfo.get("firstname") as string,
    lastname: formInfo.get("lastname") as string,
    email: formInfo.get("email") as string,
    password: formInfo.get("password") as string,
  };
     const result = userSchema.safeParse(plainData)
     if (!result.success) {
      console.error(result.error)
      setError(result.error.format())
      setIsLoading(false)
    } else {
      const data:any = await profile("/signup",formInfo)
      console.log(data)
        const userId = data.user._id
        const userName = data.user.firstname
        const userPic = data.user.profile_img
        setIsLoading(false)
        if (userId) {
          sessionStorage.setItem("user", JSON.stringify({name:userName,image:userPic, id:userId}))
          router.push(`/profile/${userId}`)
        }
        if(!userId){
          location.reload();
        }
    }
    } catch (error) {
      console.log(error)
    }
  }

  const handleFirstnameChange = async (e)=> {
    const value = e.target.value; 
    setFirstname(value);
    console.log(firstname)
  }
  const handleLastnameChange = async (e)=> {
    const value = e.target.value; 
    setLastname(value);
    console.log(lastname)
  }
  const handleEmailChange = async (e)=> {
    const value = e.target.value; 
    setEmail(value);
  }
  const handlePassWordChange = async (e)=> {
    const value = e.target.value; 
    setPassWord(value);
  }
  const handleConfirmPassWordChange = async (e)=> {
    const value = e.target.value; 
    setConfirmPassWord(value);
  }


  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-md">
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Sign In Form */}
          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>Enter your email and password to access your account</CardDescription>
              </CardHeader>
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="name@example.com" onChange={handleEmailChange}  required />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link href="#" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input id="password" type="password" onChange={handlePassWordChange}  required />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col pt-2 gap-2">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"} 
                  </Button>
                  <Button type="button" className="w-full bg-transparent text-black hover:text-white" onClick={()=> signIn('google')}>
                     Sign in with Google 
                  </Button>
                  <Button type="button" className="w-full bg-black" onClick={()=> signIn('github')}>
                     Sign in with GitHub  
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Sign Up Form */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>Enter your details to create a new account</CardDescription>
              </CardHeader>
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstname">First name</Label>
                      <Input id="firstname" onChange={()=> handleFirstnameChange}  required />
                      {error && (<p className="text-red"> {error?.firstname?._errors}
                        </p>)}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastname">Last name</Label>
                      <Input id="lastname" onChange={() => handleLastnameChange}  required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input id="email-signup" type="email" placeholder="name@example.com" onChange={handleEmailChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <Input id="password-signup" type="password" onChange={handlePassWordChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" onChange={handleConfirmPassWordChange} required />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required />
                    <Label htmlFor="terms" className="text-sm font-normal">
                      I agree to the
                      <Link href="#" className="text-primary hover:underline">
                        terms of service
                      </Link>
                      and
                      <Link href="#" className="text-primary hover:underline">
                        privacy policy
                      </Link>
                    </Label>
                  </div>
                </CardContent>
                <CardFooter >
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create account"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

