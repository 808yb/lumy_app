"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Sun, Moon, Plus, TrendingUp, Calendar, LogOut, Clock } from "lucide-react"
import Link from "next/link"
import { BottomNavigation } from "@/components/bottom-navigation"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      // Redirect to login if no user data
      router.push("/login")
      return
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const recentScans = [
    {
      id: 1,
      name: "Hydrating Serum",
      brand: "The Ordinary",
      image: "/skincare-serum-bottle.png",
      daysAgo: 2,
      score: 85,
      status: "safe",
    },
    {
      id: 2,
      name: "Gentle Cleanser",
      brand: "CeraVe",
      image: "/skincare-cleanser-bottle.png",
      daysAgo: 3,
      score: 92,
      status: "safe",
    },
    {
      id: 3,
      name: "Moisturizer",
      brand: "Neutrogena",
      image: "/skincare-moisturizer-jar.png",
      daysAgo: 7,
      score: 78,
      status: "caution",
    },
  ]

  const routineReminders = [
    {
      id: 1,
      time: "08:00",
      routine: "My Morning Routine",
      icon: Sun,
      completed: false,
      products: 4,
      enabled: true,
      estimatedTime: "8-10 minutes",
    },
    {
      id: 2,
      time: "20:00",
      routine: "My Evening Routine",
      icon: Moon,
      completed: true,
      products: 4,
      enabled: true,
      estimatedTime: "10-12 minutes",
    },
    {
      id: 3,
      time: "07:30",
      routine: "Quick Morning Routine",
      icon: Sun,
      completed: false,
      products: 3,
      enabled: true,
      estimatedTime: "5-7 minutes",
    },
  ]

  const todayStats = {
    scansToday: 2,
    routinesCompleted: 1,
    streakDays: 7,
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-primary"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      safe: "bg-secondary text-primary border-border",
      caution: "bg-yellow-100 text-yellow-800 border-yellow-200",
      avoid: "bg-red-100 text-red-800 border-red-200",
    }
    return variants[status as keyof typeof variants] || variants.safe
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-background">
        <div className="flex items-center justify-end p-4 pt-safe">
          <div className="w-8 h-8 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground text-sm">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="h-full flex flex-col bg-background page-with-bottom-nav">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-safe">
        <div className="flex items-center space-x-2">
          {user.isAdmin && (
            <Badge variant="secondary" className="text-xs">
              Admin
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild className="touch-manipulation">
            <Link href="/settings">
              <Settings className="h-5 w-5 text-foreground" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="touch-manipulation">
            <LogOut className="h-5 w-5 text-foreground" />
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 space-y-6 pb-6">
        {/* User Profile Section */}
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-2 border-primary/20 flex-shrink-0">
                <AvatarFallback className="text-lg bg-secondary text-secondary-foreground">
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-semibold text-foreground truncate">{user.name}</h1>
                <p className="text-muted-foreground text-sm">{user.age} years old</p>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Hair type: <span className="text-foreground font-medium">{user.hairType}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Skin type: <span className="text-foreground font-medium">{user.skinType}</span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="touch-manipulation">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center w-8 h-8 bg-secondary rounded-full mx-auto mb-2">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <p className="text-xl font-bold text-foreground">{todayStats.scansToday}</p>
              <p className="text-xs text-muted-foreground">Scans Today</p>
            </CardContent>
          </Card>
          <Card className="touch-manipulation">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center w-8 h-8 bg-secondary rounded-full mx-auto mb-2">
                <Calendar className="h-4 w-4 text-accent" />
              </div>
              <p className="text-xl font-bold text-foreground">{todayStats.streakDays}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </CardContent>
          </Card>
          <Card className="touch-manipulation">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center w-8 h-8 bg-secondary rounded-full mx-auto mb-2">
                <Sun className="h-4 w-4 text-primary" />
              </div>
              <p className="text-xl font-bold text-foreground">{todayStats.routinesCompleted}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Scans */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent Scans</h2>
            <Button variant="ghost" size="sm" asChild className="touch-manipulation">
              <Link href="/scan" className="text-primary text-sm">
                View All
              </Link>
            </Button>
          </div>
          <div className="flex space-x-3 overflow-x-auto pb-2 -mx-4 px-4">
            {recentScans.map((scan) => (
              <Card key={scan.id} className="flex-shrink-0 w-32 cursor-pointer hover:bg-accent/50 transition-colors touch-manipulation">
                <CardContent className="p-3">
                  <Link href={`/product/${scan.id}`} className="block">
                    <div className="aspect-square bg-secondary rounded-lg mb-2 overflow-hidden" />
                    <div className="space-y-1">
                      <h3 className="font-medium text-xs text-card-foreground line-clamp-2 leading-tight">{scan.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {scan.daysAgo === 1 ? "1 day ago" : `${scan.daysAgo} days ago`}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge className={`${getStatusBadge(scan.status)} text-xs`} variant="outline">
                          {scan.status}
                        </Badge>
                        <span className={`text-xs font-medium ${getScoreColor(scan.score)}`}>{scan.score}</span>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
            <Card className="flex-shrink-0 w-32 border-dashed border-2 border-muted-foreground/30">
              <CardContent className="p-3 h-full flex flex-col items-center justify-center">
                <Button variant="ghost" size="sm" asChild className="h-full w-full touch-manipulation">
                  <Link href="/scan" className="flex flex-col items-center space-y-2">
                    <Plus className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground text-center leading-tight">Scan New Product</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Routine Reminders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Routine Reminders</h2>
            <Button variant="ghost" size="sm" asChild className="touch-manipulation">
              <Link href="/routines" className="text-primary text-sm">
                Manage
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
            {routineReminders.map((reminder) => {
              const Icon = reminder.icon
              const isMorning = reminder.icon === Sun
              return (
                <Card
                  key={reminder.id}
                  className={`cursor-pointer transition-colors touch-manipulation ${
                    reminder.completed ? "bg-secondary border-border" : "hover:bg-accent/50"
                  }`}
                >
                  <CardContent className="p-4">
                    <Link href={`/routines/${reminder.id}`} className="flex items-center space-x-3">
                      <div className="p-2 rounded-full flex-shrink-0">
                        <Icon
                          className={`h-5 w-5 ${
                            reminder.completed 
                              ? "text-primary" 
                              : isMorning 
                                ? "text-orange-600" 
                                : "text-blue-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <p className="font-medium text-card-foreground text-sm">{formatTime(reminder.time)}</p>
                          </div>
                          {reminder.completed && (
                            <Badge className="bg-secondary text-primary border-border text-xs">Completed</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{reminder.routine}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-muted-foreground">{reminder.products} products</p>
                          <span className="text-xs text-muted-foreground">•</span>
                          <p className="text-xs text-muted-foreground">{reminder.estimatedTime}</p>
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 pb-4">
          <Button asChild className="h-12 text-sm font-medium touch-manipulation">
            <Link href="/scan">
              <TrendingUp className="mr-2 h-4 w-4" />
              Scan Product
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-12 text-sm font-medium bg-transparent touch-manipulation">
            <Link href="/routines/new">
              <Plus className="mr-2 h-4 w-4" />
              New Routine
            </Link>
          </Button>
        </div>
      </div>

      <BottomNavigation currentPage="home" />
    </div>
  )
}
