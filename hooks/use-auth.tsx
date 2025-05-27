"use client"

import { useState, createContext, useContext, ReactNode, useCallback, useEffect } from 'react'
import { ACCESS_TOKEN } from '@/lib/constants'

interface AuthContextType {
  isAuthenticated: boolean
  setIsAuthenticated: (value: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  // Initialize auth state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(ACCESS_TOKEN)
      console.log('AuthProvider initializing, token exists:', !!token)
      setIsAuthenticated(!!token)
    }
  }, [])

  // Sync auth state with localStorage
  const setAuth = useCallback((value: boolean) => {
    console.log('setAuth called with:', value)
    setIsAuthenticated(value)
    
    if (typeof window !== 'undefined') {
      if (!value) {
        console.log('Removing token from localStorage')
        localStorage.removeItem(ACCESS_TOKEN)
      } else {
        console.log('Token should be set in localStorage by the login process')
      }
    }
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated: setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
