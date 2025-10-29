"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Edit, Trash2, Clock, CheckCircle, RotateCcw } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

const SAMPLE_ROUTINE = {
  id: 1,
  name: "My Morning Routine",
  type: "morning",
  products: [
    {
      id: 1,
      name: "Gentle Foaming Cleanser",
      category: "Cleanser",
      image: "/cleanser-icon.png",
      order: 1,
      instructions: "Apply to damp skin, massage gently, rinse with lukewarm water",
    },
    {
      id: 3,
      name: "Vitamin C Serum",
      category: "Serum",
      image: "/vitamin-c-serum-icon.png",
      order: 2,
      instructions: "Apply 2-3 drops to clean skin, pat gently until absorbed",
    },
    {
      id: 4,
      name: "Daily Moisturizing Lotion",
      category: "Moisturizer",
      image: "/moisturizer-icon.png",
      order: 3,
      instructions: "Apply evenly to face and neck, massage until absorbed",
    },
    {
      id: 5,
      name: "Broad Spectrum SPF 30",
      category: "Sunscreen",
      image: "/sunscreen-icon.png",
      order: 4,
      instructions: "Apply generously 15 minutes before sun exposure",
    },
    {
      id: 6,
      name: "Hydrating Toner",
      category: "Toner",
      image: "/toner-icon.png",
      order: 2,
      instructions: "Apply with cotton pad or pat gently with fingertips",
    },
    {
      id: 7,
      name: "Eye Cream",
      category: "Treatment",
      image: "/eye-cream-icon.png",
      order: 3,
      instructions: "Apply small amount around eye area, pat gently",
    },
  ],
  estimatedTime: "8-10 minutes",
  lastUsed: "Today",
}

export default function RoutineDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [routine] = useState(SAMPLE_ROUTINE) // In real app, fetch by params.id
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(`carefulapp-routine-progress-${routine.id}`)
    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress)
        setCompletedSteps(parsedProgress)
      } catch (error) {
        console.error('Error parsing saved progress:', error)
      }
    }
    setIsLoaded(true)
  }, [routine.id])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(`carefulapp-routine-progress-${routine.id}`, JSON.stringify(completedSteps))
    }
  }, [completedSteps, isLoaded, routine.id])

  const handleStepComplete = (productId: number) => {
    setCompletedSteps((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const handleDeleteRoutine = () => {
    const confirmed = confirm("Are you sure you want to delete this routine?")
    if (confirmed) {
      // Delete routine logic here
      router.push("/routines")
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Cleanser: "bg-blue-100 text-blue-800 border-blue-200",
      Toner: "bg-purple-100 text-purple-800 border-purple-200",
      Serum: "bg-secondary text-primary border-border",
      Moisturizer: "bg-orange-100 text-orange-800 border-orange-200",
      Sunscreen: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Treatment: "bg-red-100 text-red-800 border-red-200",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const allStepsCompleted = completedSteps.length === routine.products.length

  // Don't render until localStorage is loaded to prevent hydration mismatch
  if (!isLoaded) {
    return (
      <div className="h-full bg-background flex flex-col">
        <div className="flex items-center justify-between p-4 pt-safe border-b border-border">
          <Button variant="ghost" size="icon" asChild className="touch-manipulation">
            <Link href="/routines">
              <ChevronLeft className="h-6 w-6" />
            </Link>
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="touch-manipulation">
              <Edit className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="touch-manipulation">
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading routine...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-safe border-b border-border">
        <Button variant="ghost" size="icon" asChild className="touch-manipulation">
          <Link href="/routines">
            <ChevronLeft className="h-6 w-6" />
          </Link>
        </Button>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="touch-manipulation">
            <Edit className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDeleteRoutine} className="touch-manipulation">
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Routine Header */}
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold text-foreground inline-flex items-center gap-2">
            {routine.name}
          </h1>
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{routine.estimatedTime}</span>
            </div>
            <span>•</span>
            <span>Last used: {routine.lastUsed}</span>
          </div>
        </div>

        {/* Progress */}
        <Card className={`transition-all duration-500 ${
          allStepsCompleted 
            ? "border-border bg-secondary shadow-lg" 
            : completedSteps.length > 0 
              ? "border-primary/20 bg-primary/5" 
              : "border-border"
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-card-foreground text-sm">
                Progress: {completedSteps.length}/{routine.products.length}
              </span>
              {allStepsCompleted && (
                <div className="flex items-center space-x-2 text-primary animate-pulse">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium text-sm">Complete!</span>
                </div>
              )}
            </div>
            <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-700 ease-out ${
                  allStepsCompleted 
                    ? "bg-primary" 
                    : "bg-gradient-to-r from-primary to-primary/80"
                }`}
                style={{ 
                  width: `${(completedSteps.length / routine.products.length) * 100}%`,
                  transform: completedSteps.length > 0 ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'left'
                }}
              />
            </div>
            {completedSteps.length > 0 && (
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>{allStepsCompleted ? 'Completed' : `${Math.round((completedSteps.length / routine.products.length) * 100)}% complete`}</span>
                <span>{Math.max(0, routine.products.length - completedSteps.length)} steps remaining</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Products */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Steps</h2>
          <div className="space-y-3">
            {routine.products
              .sort((a, b) => a.order - b.order)
              .map((product, index) => {
                const isCompleted = completedSteps.includes(product.id)

                return (
                  <Card
                    key={product.id}
                    className={`cursor-pointer transition-all duration-300 touch-manipulation transform hover:scale-[1.02] ${
                      isCompleted 
                        ? "bg-secondary border-border shadow-md" 
                        : "hover:bg-accent/30 hover:shadow-sm"
                    }`}
                    onClick={() => handleStepComplete(product.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium flex-shrink-0 transition-all duration-300 ${
                          isCompleted 
                            ? "bg-primary text-primary-foreground scale-110" 
                            : "bg-primary text-primary-foreground"
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 animate-pulse" />
                          ) : (
                            <span className="transition-all duration-300">{index + 1}</span>
                          )}
                        </div>
                        <div className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                          isCompleted ? "bg-secondary" : "bg-secondary"
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3
                              className={`font-medium text-sm transition-all duration-300 ${
                                isCompleted 
                                  ? "line-through text-muted-foreground" 
                                  : "text-card-foreground"
                              }`}
                            >
                              {product.name}
                            </h3>
                            <Badge className={`${getCategoryColor(product.category)} text-xs transition-all duration-300 ${
                              isCompleted ? "opacity-60" : "opacity-100"
                            }`} variant="outline">
                              {product.category}
                            </Badge>
                          </div>
                          <p className={`text-sm transition-all duration-300 ${
                            isCompleted ? "text-muted-foreground/60" : "text-muted-foreground"
                          }`}>
                            {product.instructions}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pb-4">
          {allStepsCompleted ? (
            <div className="space-y-2">
              <Button
                onClick={() => setCompletedSteps([])}
                variant="outline"
                className="w-full h-12 text-base font-medium touch-manipulation transition-all duration-300 hover:scale-[1.02]"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Start Again
              </Button>
              <div className="text-center">
                <p className="text-sm text-green-600 font-medium">🎉 Great job! Routine completed!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Button
                onClick={() => setCompletedSteps(routine.products.map((p) => p.id))}
                className="w-full h-12 text-base font-medium touch-manipulation transition-all duration-300 hover:scale-[1.02]"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark All Complete
              </Button>
              {completedSteps.length > 0 && (
                <Button
                  onClick={() => setCompletedSteps([])}
                  variant="ghost"
                  className="w-full h-10 text-sm touch-manipulation transition-all duration-300"
                >
                  <RotateCcw className="mr-2 h-3 w-3" />
                  Reset Progress
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
