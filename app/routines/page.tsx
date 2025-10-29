"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Clock, Edit, Trash2, MoreVertical, Sun, Moon } from "lucide-react"
import Link from "next/link"
import { BottomNavigation } from "@/components/bottom-navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const SAMPLE_ROUTINES = {
  morning: [
    {
      id: 1,
      name: "My Morning Routine",
      products: ["Cleanser", "Serum", "Moisturizer", "Sunscreen"],
      productCount: 4,
      time: "08:00",
      enabled: true,
      estimatedTime: "8-10 minutes",
      lastUsed: "Today at 08:15",
      streak: 7,
      category: "Daily",
    },
    {
      id: 3,
      name: "Quick Morning Routine",
      products: ["Cleanser", "Moisturizer", "Sunscreen"],
      productCount: 3,
      time: "07:30",
      enabled: true,
      estimatedTime: "5-7 minutes",
      lastUsed: "Yesterday at 07:45",
      streak: 3,
      category: "Quick",
    },
    {
      id: 4,
      name: "Intensive Morning Routine",
      products: ["Cleanser", "Toner", "Serum", "Moisturizer", "Sunscreen"],
      productCount: 5,
      time: "08:30",
      enabled: false,
      estimatedTime: "12-15 minutes",
      lastUsed: "Never completed",
      streak: 0,
      category: "Intensive",
    },
  ],
  evening: [
    {
      id: 2,
      name: "My Evening Routine",
      products: ["Cleanser", "Toner", "Treatment", "Night Cream"],
      productCount: 4,
      time: "20:00",
      enabled: true,
      estimatedTime: "10-12 minutes",
      lastUsed: "Today at 20:30",
      streak: 5,
      category: "Daily",
    },
    {
      id: 5,
      name: "Deep Clean Evening",
      products: ["Oil Cleanser", "Foam Cleanser", "Toner", "Serum", "Night Cream"],
      productCount: 5,
      time: "21:00",
      enabled: true,
      estimatedTime: "15-18 minutes",
      lastUsed: "2 days ago at 21:15",
      streak: 2,
      category: "Deep Clean",
    },
  ],
}

export default function RoutinesPage() {
  const [activeTab, setActiveTab] = useState("morning")
  const [routines, setRoutines] = useState(SAMPLE_ROUTINES)
  const [isLoaded, setIsLoaded] = useState(false)
  const [routineProgress, setRoutineProgress] = useState<Record<number, number[]>>({})

  const saveRoutinesToStorage = (newRoutines: typeof SAMPLE_ROUTINES) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('carefulapp-routines', JSON.stringify(newRoutines))
    }
  }

  const handleDeleteRoutine = (routineId: number) => {
    const confirmed = confirm("Are you sure you want to delete this routine?")
    if (confirmed) {
      // Find the routine name before deleting for feedback
      const routineToDelete = [...routines.morning, ...routines.evening].find(r => r.id === routineId)
      
      const newRoutines = {
        morning: routines.morning.filter(routine => routine.id !== routineId),
        evening: routines.evening.filter(routine => routine.id !== routineId)
      }
      
      setRoutines(newRoutines)
      saveRoutinesToStorage(newRoutines)
      
      if (routineToDelete) {
        console.log(`Routine "${routineToDelete.name}" deleted`)
      }
    }
  }

  const handleToggleRoutine = (routineId: number) => {
    const newRoutines = {
      morning: routines.morning.map(routine => 
        routine.id === routineId 
          ? { ...routine, enabled: !routine.enabled }
          : routine
      ),
      evening: routines.evening.map(routine => 
        routine.id === routineId 
          ? { ...routine, enabled: !routine.enabled }
          : routine
      )
    }
    
    setRoutines(newRoutines)
    saveRoutinesToStorage(newRoutines)
    
    // Find the routine that was toggled
    const toggledRoutine = [...newRoutines.morning, ...newRoutines.evening].find(r => r.id === routineId)
    if (toggledRoutine) {
      const status = toggledRoutine.enabled ? "enabled" : "disabled"
      console.log(`Routine "${toggledRoutine.name}" ${status}`)
    }
  }

  const handleAddRoutine = (newRoutine: any) => {
    const routineType = newRoutine.type || 'morning'
    const routineWithId = {
      ...newRoutine,
      id: Date.now(), // Simple ID generation
      lastUsed: "Never",
      enabled: true,
      streak: 0
    }
    
    const newRoutines = {
      ...routines,
      [routineType]: [...routines[routineType as keyof typeof routines], routineWithId]
    }
    
    setRoutines(newRoutines)
    saveRoutinesToStorage(newRoutines)
  }

  const incrementStreak = (routineId: number) => {
    const newRoutines = {
      morning: routines.morning.map(routine => 
        routine.id === routineId 
          ? { ...routine, streak: routine.streak + 1 }
          : routine
      ),
      evening: routines.evening.map(routine => 
        routine.id === routineId 
          ? { ...routine, streak: routine.streak + 1 }
          : routine
      )
    }
    
    setRoutines(newRoutines)
    saveRoutinesToStorage(newRoutines)
  }

  const resetToSampleRoutines = () => {
    setRoutines(SAMPLE_ROUTINES)
    saveRoutinesToStorage(SAMPLE_ROUTINES)
    console.log('Reset to sample routines')
  }

  // Load routines and progress from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('carefulapp-routines')
    if (saved) {
      try {
        const parsedRoutines = JSON.parse(saved)
        setRoutines(parsedRoutines)
      } catch (error) {
        console.error('Error parsing saved routines:', error)
      }
    }

    // Load progress for all routines
    const allRoutines = [...SAMPLE_ROUTINES.morning, ...SAMPLE_ROUTINES.evening]
    const progressData: Record<number, number[]> = {}
    
    allRoutines.forEach(routine => {
      const savedProgress = localStorage.getItem(`carefulapp-routine-progress-${routine.id}`)
      if (savedProgress) {
        try {
          progressData[routine.id] = JSON.parse(savedProgress)
        } catch (error) {
          console.error(`Error parsing progress for routine ${routine.id}:`, error)
        }
      }
    })
    
    setRoutineProgress(progressData)
    setIsLoaded(true)
  }, [])

  // Save routines to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveRoutinesToStorage(routines)
    }
  }, [routines, isLoaded])

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    return `${hours}:${minutes}`
  }

  const getStatusColor = (enabled: boolean) => {
    return enabled ? "text-primary" : "text-muted-foreground"
  }

  const getStatusBadge = (enabled: boolean) => {
    return enabled ? (
      <Badge className="bg-secondary text-primary border-border text-xs">
        Active
      </Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-xs">
        Paused
      </Badge>
    )
  }

  const getProgressInfo = (routineId: number, productCount: number) => {
    const completedSteps = routineProgress[routineId] || []
    const completedCount = completedSteps.length
    const isCompleted = completedCount >= productCount && productCount > 0
    const rawPercent = productCount > 0 ? (completedCount / productCount) * 100 : 0
    const progressPercentage = Math.min(100, rawPercent)
    
    return {
      completedCount,
      isCompleted,
      progressPercentage,
      hasProgress: completedCount > 0
    }
  }

  // Don't render until localStorage is loaded to prevent hydration mismatch
  if (!isLoaded) {
    return (
      <div className="h-full bg-background flex flex-col">
        <div className="flex items-center justify-between p-4 pt-safe border-b border-border">
          <h1 className="text-lg font-semibold text-foreground">Routines</h1>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={resetToSampleRoutines}
              variant="outline"
              size="sm"
              className="touch-manipulation text-xs"
            >
              Reset
            </Button>
            <Button size="icon" asChild className="touch-manipulation">
              <Link href="/routines/new">
                <Plus className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading routines...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-background flex flex-col page-with-bottom-nav">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-safe border-b border-border">
        <h1 className="text-lg font-semibold text-foreground">Routines</h1>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={resetToSampleRoutines}
            variant="outline"
            size="sm"
            className="touch-manipulation text-xs"
          >
            Reset
          </Button>
          <Button size="icon" asChild className="touch-manipulation">
            <Link href="/routines/new">
              <Plus className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
          <div className="px-4 py-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="morning" className="text-sm touch-manipulation">Morning</TabsTrigger>
              <TabsTrigger value="evening" className="text-sm touch-manipulation">Evening</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="morning" className="flex-1 overflow-y-auto px-4 pb-6 data-[state=inactive]:hidden">
            <div className="space-y-3">
              {routines.morning.length > 0 ? (
                routines.morning.map((routine) => {
                  const progressInfo = getProgressInfo(routine.id, routine.productCount)
                  
                  return (
                    <Card key={routine.id} className={`cursor-pointer transition-all duration-300 touch-manipulation hover:scale-[1.02] ${
                      progressInfo.isCompleted 
                        ? "bg-secondary border-border shadow-md" 
                        : progressInfo.hasProgress 
                          ? "bg-primary/5 border-primary/20" 
                          : "hover:bg-accent/50"
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Link href={`/routines/${routine.id}`} className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className={`w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                                progressInfo.isCompleted ? "bg-secondary" : "bg-orange-50"
                              }`}>
                                <Sun className={`h-7 w-7 transition-all duration-300 ${
                                  progressInfo.isCompleted ? "text-primary" : "text-orange-600"
                                }`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center space-x-2">
                                    <h3 className={`font-medium text-sm transition-all duration-300 ${
                                      progressInfo.isCompleted ? "text-primary" : "text-card-foreground"
                                    }`}>
                                      {routine.name}
                                    </h3>
                                    {getStatusBadge(routine.enabled)}
                                    {/* Completed badge removed to avoid duplication with progress label */}
                                  </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-6 w-6 touch-manipulation"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                      <Link href={`/routines/${routine.id}/edit`} className="flex items-center">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation()
                                      handleToggleRoutine(routine.id)
                                    }}>
                                      {routine.enabled ? "Disable" : "Enable"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteRoutine(routine.id)
                                      }}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              <div className="flex items-center space-x-6 text-xs text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span className="text-foreground font-medium">{formatTime(routine.time)}</span>
                                </div>
                                <span>{routine.estimatedTime}</span>
                                {routine.streak > 0 ? (
                                  <span className="text-orange-600 font-medium">🔥 {routine.streak} day streak!</span>
                                ) : (
                                  <span className="text-muted-foreground">Last: {routine.lastUsed}</span>
                                )}
                              </div>
                              {progressInfo.hasProgress && (
                                <div className="mt-2">
                                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                    <span>Progress: {progressInfo.completedCount}/{routine.productCount}</span>
                                    <span>{progressInfo.isCompleted ? 'Completed' : `${Math.round(progressInfo.progressPercentage)}%`}</span>
                                  </div>
                                  <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                                    <div
                                      className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                                        progressInfo.isCompleted 
                                          ? "bg-primary" 
                                          : "bg-gradient-to-r from-primary to-primary/80"
                                      }`}
                                      style={{ 
                                        width: `${progressInfo.progressPercentage}%`,
                                        transform: progressInfo.hasProgress ? 'scaleX(1)' : 'scaleX(0)',
                                        transformOrigin: 'left'
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                              <p className="text-xs text-muted-foreground truncate mt-1">{routine.products.join(", ")}</p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                  )
                })
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4 text-sm">No morning routines yet</p>
                  <Button asChild className="touch-manipulation">
                    <Link href="/routines/new?type=morning">Create Morning Routine</Link>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="evening" className="flex-1 overflow-y-auto px-4 pb-6 data-[state=inactive]:hidden">
            <div className="space-y-3">
              {routines.evening.length > 0 ? (
                routines.evening.map((routine) => {
                  const progressInfo = getProgressInfo(routine.id, routine.productCount)
                  
                  return (
                    <Card key={routine.id} className={`cursor-pointer transition-all duration-300 touch-manipulation hover:scale-[1.02] ${
                      progressInfo.isCompleted 
                        ? "bg-secondary border-border shadow-md" 
                        : progressInfo.hasProgress 
                          ? "bg-primary/5 border-primary/20" 
                          : "hover:bg-accent/50"
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Link href={`/routines/${routine.id}`} className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className={`w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                                progressInfo.isCompleted ? "bg-secondary" : "bg-blue-50"
                              }`}>
                                <Moon className={`h-7 w-7 transition-all duration-300 ${
                                  progressInfo.isCompleted ? "text-primary" : "text-blue-600"
                                }`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center space-x-2">
                                    <h3 className={`font-medium text-sm transition-all duration-300 ${
                                      progressInfo.isCompleted ? "text-primary" : "text-card-foreground"
                                    }`}>
                                      {routine.name}
                                    </h3>
                                    {getStatusBadge(routine.enabled)}
                                    {/* Completed badge removed to avoid duplication with progress label */}
                                  </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-6 w-6 touch-manipulation"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                      <Link href={`/routines/${routine.id}/edit`} className="flex items-center">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation()
                                      handleToggleRoutine(routine.id)
                                    }}>
                                      {routine.enabled ? "Disable" : "Enable"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteRoutine(routine.id)
                                      }}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              <div className="flex items-center space-x-6 text-xs text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span className="text-foreground font-medium">{formatTime(routine.time)}</span>
                                </div>
                                <span>{routine.estimatedTime}</span>
                                {routine.streak > 0 ? (
                                  <span className="text-orange-600 font-medium">🔥 {routine.streak} day streak!</span>
                                ) : (
                                  <span className="text-muted-foreground">Last: {routine.lastUsed}</span>
                                )}
                              </div>
                              {progressInfo.hasProgress && (
                                <div className="mt-2">
                                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                    <span>Progress: {progressInfo.completedCount}/{routine.productCount}</span>
                                    <span>{progressInfo.isCompleted ? 'Completed' : `${Math.round(progressInfo.progressPercentage)}%`}</span>
                                  </div>
                                  <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                                    <div
                                      className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                                        progressInfo.isCompleted 
                                          ? "bg-primary" 
                                          : "bg-gradient-to-r from-primary to-primary/80"
                                      }`}
                                      style={{ 
                                        width: `${progressInfo.progressPercentage}%`,
                                        transform: progressInfo.hasProgress ? 'scaleX(1)' : 'scaleX(0)',
                                        transformOrigin: 'left'
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                              <p className="text-xs text-muted-foreground truncate mt-1">{routine.products.join(", ")}</p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                  )
                })
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4 text-sm">No evening routines yet</p>
                  <Button asChild className="touch-manipulation">
                    <Link href="/routines/new?type=evening">Create Evening Routine</Link>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation currentPage="routines" />
    </div>
  )
}
