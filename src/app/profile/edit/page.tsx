"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Upload, ArrowLeft, Camera } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { editProfile } from "@/utils/api"
import { getUser } from "@/utils/userApi"

// Mock user data

export default function EditProfilePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null | any>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [profile, setProfile] = useState()
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    bio: "",
    occupation: "",
    avatar: "",
    gender: "",
    role: "",
    address: [],
    socialLinks: "",
    password: ""
  }
  )
  const [userId, setUserId] = useState();
  useEffect(()=> {
    const getSession = () => {
      const session = sessionStorage.getItem("user")
      setUserId(session ? JSON.parse(session) : null)
    }
    
    getSession()
    
    
  },[])
  
  useEffect(()=> {
    console.log(userId)
    if (userId) {
    const getInfo = async () => {
        const data = await getUser(userId?.id)
        console.log(data)
        data ? setProfile(data) : console.error("No Data")  
        setProfileData({
          firstName: data?.firstName || data?.name || "",
          lastName: data?.lastName || "",
          username: data?.username || "",
          email: data?.email || "",
          phone: data?.phone || "",
          bio: data?.bio || "",
          occupation: data?.occupation || "",
          profile_img: data?.profile_img || "",
          gender: data?.gender || "",
          role: data?.role || "",
          address: Array.isArray(data.address) ? data.address : [],
          socials: Array.isArray(data.socials) ? data.socials : [],
      })
    }
      getInfo();
    } else {
      console.error("No USER Detected")
    }

  },[userId])


  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setProfileData({
        ...profileData,
        [parent]: {
          ...profileData[parent as keyof typeof profileData],
          [child]: value,
        },
      })
    } else {
      setProfileData({
        ...profileData,
        [name]: value,
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setProfileData({
      ...profileData,
      [name]: value,
    })
  }

  const formInfo = new FormData();
  
    formInfo.append( "firstname",profileData?.firstName || profileData?.name)
    formInfo.append("lastname" ,profileData?.lastName || profileData?.lastname)
    formInfo.append("username" ,profileData?.username || profileData?.username)
    formInfo.append("email" ,profileData?.email || profileData?.email)
    formInfo.append("phone" ,profileData?.phone || profileData?.phone)
    formInfo.append("bio" ,profileData?.bio || profileData?.bio)
    formInfo.append("profile_img" , avatarFile || profileData?.profile_img?.map((i)=> i.value) )
    formInfo.append("socials" ,JSON.stringify(profileData?.socials))
    formInfo.append("address" ,JSON.stringify(profileData?.address))
    formInfo.append("gender" , profileData?.gender)
    // formInfo.append("password" ,profileData?.password)


  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      console.log(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      console.log(avatarPreview)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    formInfo.forEach((value,key) => {
      console.log(key,value)
    })
    console.log("address :",profileData?.address, "socials", profileData?.socialLinks, "data", profileData)
    // const data = editProfile()
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
     // router.push("/profile")
    }, 1500)
  }

  return (
  <div className="py-12 flex items-center justify-center">

    <div className="container max-w-4xl">
    <Link href={`/profile/${userId?.id}`}>
      <Button variant="ghost" size="sm" className="mb-6 lg:-ml-40">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to profile
      </Button>
    </Link>

    <div className="flex items-center justify-between px-5 md:px-2 mb-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Profile</h1>
        <p className="text-muted-foreground">Update your personal information and preferences</p>
      </div>
      <div>{profileData?.role && <Badge className="bg-primary">Admin</Badge>}</div>
    </div>
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="contact">Contact Details</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and public profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                  <div className="relative">
                    {Array.isArray(profileData?.profile_img) && !avatarFile ? (
                    <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
                      <AvatarImage src={profileData?.profile_img.map((i)=> i.value).join("") }  alt={profileData?.firstName} />
                      <AvatarFallback>{profileData?.firstName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    ): (
                    <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
                      <AvatarImage src={avatarPreview}  alt={profileData?.firstName} />
                      <AvatarFallback>{profileData?.firstName?.charAt(0)}</AvatarFallback>
                    </Avatar> 
                    )}
                    <div
                      className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer"
                      onClick={handleAvatarClick}
                    >
                      <Camera className="h-4 w-4" />
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Profile Picture</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload a new profile picture. Recommended size: 400x400px.
                    </p>
                    <Button type="button" variant="outline" size="sm" onClick={handleAvatarClick}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={profileData?.firstName || profileData?.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={profileData?.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={profileData?.username}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">This will be displayed on your public profile</p>
                </div>

                {/* Gender and DOB */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={profileData?.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Bio and Occupation */}
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    name="occupation"
                    value={profileData?.occupation}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" name="bio" value={profileData?.bio} onChange={handleInputChange} rows={4} />
                  <p className="text-xs text-muted-foreground">
                    Write a short bio about yourself. This will be displayed on your public profile.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Details Tab */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Update your contact details and address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData?.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" value={profileData?.phone} onChange={handleInputChange} />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="address.city"
                        value={profileData?.address?.map((i)=> i.city)}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        name="address.state"
                        value={profileData?.address?.map((i)=> i.state)}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="address.country"
                        value={profileData?.address?.map((i)=> i.country)}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Social Links</h3>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      name="socialLinks.twitter"
                      value={profileData?.socials?.map((i)=> i.twitter)}
                      onChange={handleInputChange}
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      name="socialLinks.linkedin"
                      value={profileData?.socials?.map((i)=> i.linkedin)}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      name="socialLinks.github"
                      value={profileData?.socials?.map((i)=> i.github)}
                      onChange={handleInputChange}
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Settings Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences and role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* Account Security */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Account Security</h3>
                  <div className="space-y-2">
                    <Button variant="outline" type="button" className="w-full">
                      Change Password
                    </Button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="destructive" type="button">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="mt-6 flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => router.push("/profile")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  </div>

  )
}

