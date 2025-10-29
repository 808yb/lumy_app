"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { X, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setIsLoading(true)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Check if user already exists (for demo purposes)
    const existingUsers = ["admin", "olivia", "demo"]
    if (existingUsers.includes(email.toLowerCase())) {
      setError("User already exists. Please try a different email or sign in instead.")
      setIsLoading(false)
      return
    }

    // Create new user data
    const newUser = {
      name: email.split('@')[0], // Use email prefix as name
      email: email,
      age: 25,
      skinType: "Normal",
      hairType: "Normal",
      isAdmin: false,
      avatar: "/placeholder-user.jpg",
      isLoggedIn: true,
      loginTime: new Date().toISOString()
    }

    // Store user data in localStorage
    localStorage.setItem("user", JSON.stringify(newUser))
    
    // Redirect to home page
    router.push("/home")
  }

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Header with close button */}
      <div className="flex justify-start p-4 pt-safe">
        <Button variant="ghost" size="icon" className="text-foreground touch-manipulation" onClick={() => router.back()}>
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Signup Form */}
      <div className="flex-1 flex items-center justify-center px-6 pb-20">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">Create Account</h1>
            <p className="text-muted-foreground text-sm">Join Lumy to get personalized skincare recommendations</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
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
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 text-base bg-input border-border rounded-lg pr-10 touch-manipulation"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 touch-manipulation"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg touch-manipulation"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Demo Note */}
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> This is a demo app. You can also sign in with existing demo accounts:
              admin/admin, olivia/olivia123, or demo/demo123
            </p>
          </div>

          <div className="text-center pt-4">
            <span className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
