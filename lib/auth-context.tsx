"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import {
  login as apiLogin,
  signup as apiSignup,
  adminSignup as apiAdminSignup,
  logout as apiLogout,
  isLoggedIn as checkIsLoggedIn,
  getAdminMyPage,
  AdminMyPageResponse,
  LoginRequest,
  SignupRequest,
  AdminSignupRequest,
} from "@/lib/api"

interface AuthContextType {
  isLoggedIn: boolean
  isAdmin: boolean
  isInitializing: boolean
  user: AdminMyPageResponse | null
  login: (data: LoginRequest) => Promise<void>
  signup: (data: SignupRequest) => Promise<void>
  adminSignup: (data: AdminSignupRequest) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [user, setUser] = useState<AdminMyPageResponse | null>(null)

  const refreshUser = useCallback(async () => {
    setIsInitializing(true)
    if (checkIsLoggedIn()) {
      setIsLoggedIn(true)
      try {
        const userData = await getAdminMyPage()
        setUser(userData)
        setIsAdmin(!!userData.farmName)
      } catch {
        // User might not be admin, which is fine
        setIsAdmin(false)
      }
    } else {
      setIsLoggedIn(false)
      setIsAdmin(false)
      setUser(null)
    }
    setIsInitializing(false)
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = async (data: LoginRequest) => {
    await apiLogin(data)
    await refreshUser()
  }

  const signup = async (data: SignupRequest) => {
    await apiSignup(data)
    await refreshUser()
  }

  const adminSignup = async (data: AdminSignupRequest) => {
    await apiAdminSignup(data)
    await refreshUser()
  }

  const logout = () => {
    apiLogout()
    setIsLoggedIn(false)
    setIsAdmin(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, isInitializing, user, login, signup, adminSignup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
