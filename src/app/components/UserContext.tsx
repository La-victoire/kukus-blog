"use client"
import { getUser } from '@/utils/userApi';
import React, { createContext, useContext, useEffect, useState } from 'react'

const UserContext = createContext<any>({});

type ApiResponse = {
  success: boolean;
  data: any;
  message?: string;
};

export const UserProvider = ({children}:any) => {
  const [user ,setUser] = useState<any>()

  useEffect(() => {

  })
  const fetchUser = async () => {
    const profile = await getUser("/")
    setUser(profile)
  }
  return (
    <UserContext.Provider value={{user, fetchUser}}>
        {children}
    </UserContext.Provider>
  )
}


