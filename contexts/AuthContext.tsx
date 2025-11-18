// contexts/AuthContext.tsx - Updated with token management
"use client"

import AsyncStorage from "@react-native-async-storage/async-storage"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { Platform } from "react-native"

interface User {
  id: string
  name: string
  phoneNumber: string
  email: string
  address: string
  memberSince?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const getApiBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return   'https://quickspin.nexusmwi.com/api' //'http://10.84.11.20:4000/api'
    } else {
      return  'https://quickspin.nexusmwi.com/api' //'http://10.84.11.20:4000/api'
    }
  }
  return  'https://quickspin.nexusmwi.com/api'  //'http://10.84.11.20:4000/api'
}

const API_BASE_URL = getApiBaseUrl()

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token")
      const userData = await AsyncStorage.getItem("user")
      
      console.log('🔍 Loading stored auth data:', { 
        hasToken: !!storedToken, 
        hasUser: !!userData 
      })
      
      if (storedToken && userData) {
        setToken(storedToken)
        setUser(JSON.parse(userData))
        setIsAuthenticated(true)
        console.log('✅ User loaded from storage:', JSON.parse(userData).email)
      }
    } catch (error) {
      console.error("❌ Error loading user:", error)
    } finally {
      setLoading(false)
    }
  }

  const makeApiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${API_BASE_URL}${endpoint}`
    
    console.log(`🌐 Making API request to: ${url}`)
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
      console.log('🔐 Adding authorization token to request')
    }

    const response = await fetch(url, {
      headers,
      ...options,
    })

    const responseText = await response.text()
    console.log(`📨 Response status: ${response.status}`)
    console.log(`📨 Response body:`, responseText)

    let data
    try {
      data = responseText ? JSON.parse(responseText) : {}
    } catch (e) {
      console.error('❌ Failed to parse JSON response:', responseText)
      throw new Error('Invalid response from server')
    }

    if (!response.ok) {
      // If token is invalid, logout
      if (response.status === 401) {
        console.log('❌ Token invalid, logging out...')
        await logout()
      }
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return data
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      console.log(`🔐 Attempting login to: ${API_BASE_URL}/auth/login`)
      
      const data = await makeApiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      console.log('✅ Login API response received:', data)

      // Store token and user data
      await AsyncStorage.setItem("token", data.token)
      await AsyncStorage.setItem("user", JSON.stringify(data.user))
      
      setToken(data.token)
      setUser(data.user)
      setIsAuthenticated(true)
      
      console.log('✅ Login successful, user authenticated')
    } catch (error: any) {
      console.error('❌ Login API error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: any) => {
    try {
      setLoading(true)
      
      console.log(`📝 Attempting registration to: ${API_BASE_URL}/auth/register`)
      
      const data = await makeApiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      })

      console.log('✅ Registration API response received:', data)

      // Store token and user data
      await AsyncStorage.setItem("token", data.token)
      await AsyncStorage.setItem("user", JSON.stringify(data.user))
      
      setToken(data.token)
      setUser(data.user)
      setIsAuthenticated(true)
      
      console.log('✅ Registration successful, user authenticated')
    } catch (error: any) {
      console.error("❌ Registration error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token")
      await AsyncStorage.removeItem("user")
      setToken(null)
      setUser(null)
      setIsAuthenticated(false)
      console.log('✅ Logout successful')
    } catch (error) {
      console.error("❌ Error during logout:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      register, 
      logout, 
      loading,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}      