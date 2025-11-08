"use client"

import AsyncStorage from "@react-native-async-storage/async-storage"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  name: string
  phoneNumber: string
  email: string
  address: string
}

interface AuthContextType {
  user: User | null
  login: (userData: User) => Promise<void>
  register: (userData: User) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("user")
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error("Error loading user:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (userData: User) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
    } catch (error) {
      console.error("Error saving user:", error)
    }
  }

  const register = async (userData: User) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
    } catch (error) {
      console.error("Error saving user:", error)
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user")
      setUser(null)
    } catch (error) {
      console.error("Error removing user:", error)
    }
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
