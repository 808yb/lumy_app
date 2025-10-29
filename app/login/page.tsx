"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { X, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

// Dummy users for demo purposes
const DUMMY_USERS = {
  "admin": {
    password: "admin",
    name: "Admin User",
    email: "admin@careful.com",
    age: 30,
    skinType: "Combination",
    hairType: "Normal",
    isAdmin: true,
    avatar: "/woman-profile-avatar.png"
  },
  "olivia": {
    password: "olivia123",
    name: "Olivia Bennett",
    email: "olivia@careful.com",
    age: 24,
    skinType: "Combination",
    hairType: "Combination",
    isAdmin: false,
    avatar: "/woman-profile-avatar.png"
  },
  "demo": {
    password: "demo123",
    name: "Demo User",
    email: "demo@careful.com",
    age: 28,
    skinType: "Sensitive",
    hairType: "Dry",
    isAdmin: false,
    avatar: "/placeholder-user.jpg"
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Check if user exists in dummy data
    const user = DUMMY_USERS[email as keyof typeof DUMMY_USERS]
    
    if (user && user.password === password) {
      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify({
        ...user,
        email: email,
        isLoggedIn: true,
        loginTime: new Date().toISOString()
      }))
      
      // Redirect to home page
      router.push("/home")
    } else {
      setError("Invalid email or password")
    }
    
    setIsLoading(false)
  }

  const handleDemoLogin = () => {
    setEmail("demo")
    setPassword("demo123")
  }

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Header with close button */}
      <div className="flex justify-start p-4 pt-safe">
        <Button variant="ghost" size="icon" className="text-foreground touch-manipulation" onClick={() => router.back()}>
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 pb-20">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">Sign in to your Careful account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Email or Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-base bg-input border-border rounded-lg touch-manipulation"
                required
                disabled={isLoading}
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-base bg-input border-border rounded-lg pr-10 touch-manipulation"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 touch-manipulation"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}

            <div className="text-left">
              <Link href="/forgot-password" className="text-primary text-sm hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg touch-manipulation"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Demo Login Button */}
          <div className="text-center">
            <Button
              variant="outline"
              onClick={handleDemoLogin}
              className="w-full h-12 text-sm font-medium touch-manipulation"
              disabled={isLoading}
            >
              Try Demo Account
            </Button>
          </div>

          {/* Demo Credentials */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Demo Credentials:</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Admin:</strong> admin / admin</p>
              <p><strong>User:</strong> olivia / olivia123</p>
              <p><strong>Demo:</strong> demo / demo123</p>
            </div>
          </div>

          <div className="text-center pt-4">
            <span className="text-muted-foreground text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
