"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Truck, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import api from "@/lib/api"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/lib/constants"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated, setIsAuthenticated } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Handle authentication state changes
  useEffect(() => {
    console.log('Auth state changed - isAuthenticated:', isAuthenticated)
    console.log('Current path:', window.location.pathname)
    
    if (isAuthenticated) {
      console.log('User is authenticated, redirecting to /dashboard')
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  // Prevent rendering if already authenticated
  if (isAuthenticated) {
    return null
  }

  const setAuthCookie = (token: string, days = 7) => {
    const date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    const expires = '; expires=' + date.toUTCString()
    document.cookie = `auth_token=${token}${expires}; path=/; SameSite=Lax`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login form submitted')
    setIsLoading(true)

    try {
      // First, get the access and refresh tokens
      const tokenResponse = await api.post('/api/token/', {
        username,
        password
      })

      // Store the tokens
      const { access, refresh } = tokenResponse.data
      localStorage.setItem(ACCESS_TOKEN, access)
      localStorage.setItem(REFRESH_TOKEN, refresh)
      
      // Also set the token as a cookie for the middleware
      setAuthCookie(access)
      
      // Set authenticated state
      console.log('Setting isAuthenticated to true')
      setIsAuthenticated(true)
      
      console.log('Login successful, tokens stored. Redirecting to /dashboard')
      
      // Use a small timeout to ensure state updates before navigation
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 100)
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'An error occurred during login';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        
        errorMessage = error.response.data?.detail || 
                     error.response.data?.message || 
                     JSON.stringify(error.response.data) || 
                     `Server responded with status ${error.response.status}`;
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        errorMessage = 'No response received from server. Please check your connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request setup error:', error.message);
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold">FleetMaster</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {/* <Link href="#" className="text-sm text-primary underline-offset-4 hover:underline">
                    Forgot password?
                  </Link> */}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(!!checked)} />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="#" className="text-primary underline-offset-4 hover:underline">
                  Contact administrator
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
