// hooks/useApi.ts
import { useAuth } from '../contexts/AuthContext'

const API_BASE_URL = 'http://localhost:3000/api' // Adjust for your environment

export const useApi = () => {
  const { token } = useAuth()

  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${API_BASE_URL}${endpoint}`
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      headers,
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  return { apiRequest }
}