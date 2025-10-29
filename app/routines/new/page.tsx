"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X, AlertTriangle, Clock } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

const AVAILABLE_PRODUCTS = [
  {
    id: 1,
    name: "Gentle Foaming Cleanser",
    category: "Cleanser",
    image: "/cleanser-icon.png",
    conflicts: [],
  },
  {
    id: 2,
    name: "Hydrating Toner",
    category: "Toner",
    image: "/toner-icon.png",
    conflicts: [],
  },
  {
    id: 3,
    name: "Vitamin C Serum",
    category: "Serum",
    image: "/vitamin-c-serum-icon.png",
    conflicts: ["retinol"],
    warning: "Avoid using with retinol products",
  },
  {
    id: 4,
    name: "Daily Moisturizing Lotion",
    category: "Moisturizer",
    image: "/moisturizer-icon.png",
    conflicts: [],
  },
  {
    id: 5,
    name: "Broad Spectrum SPF 30",
    category: "Sunscreen",
    image: "/sunscreen-icon.png",
    conflicts: [],
  },
  {
    id: 6,
    name: "Retinol Treatment",
    category: "Treatment",
    image: "/retinol-icon.png",
    conflicts: ["vitamin-c"],
    warning: "Avoid using with Vitamin C in same routine",
  },
]

export default function NewRoutinePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const routineType = searchParams.get("type") || "morning"

  const [routineName, setRoutineName] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [conflicts, setConflicts] = useState<string[]>([])
  const [routineTime, setRoutineTime] = useState("08:00")
  const [isEnabled, setIsEnabled] = useState(true)

  useEffect(() => {
    // Check for conflicts when products change
    const selected = AVAILABLE_PRODUCTS.filter((p) => selectedProducts.includes(p.id))
    const newConflicts: string[] = []

    selected.forEach((product) => {
      product.conflicts.forEach((conflict) => {
        const conflictingProduct = selected.find((p) => p.category.toLowerCase().includes(conflict))
        if (conflictingProduct && conflictingProduct.id !== product.id) {
          newConflicts.push(`${product.name} conflicts with ${conflictingProduct.name}`)
        }
      })
    })

    setConflicts(newConflicts)
  }, [selectedProducts])

  const handleProductToggle = (productId: number, checked: boolean) => {
    if (checked) {
      setSelectedProducts((prev) => [...prev, productId])
    } else {
      setSelectedProducts((prev) => prev.filter((id) => id !== productId))
    }
  }

  const handleSaveRoutine = () => {
    if (!routineName.trim()) {
      alert("Please enter a routine name")
      return
    }

    if (selectedProducts.length === 0) {
      alert("Please select at least one product")
      return
    }

    if (conflicts.length > 0) {
      const proceed = confirm(
        `Warning: There are product conflicts in your routine:\n\n${conflicts.join(
          "\n",
        )}\n\nDo you want to save anyway?`,
      )
      if (!proceed) return
    }

    // Save routine logic here
    console.log("Saving routine:", {
      name: routineName,
      type: routineType,
      products: selectedProducts,
      time: routineTime,
      enabled: isEnabled,
    })

    router.push("/routines")
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

  const getDefaultTime = () => {
    return routineType === "morning" ? "08:00" : "20:00"
  }

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-safe border-b border-border">
        <Button variant="ghost" size="icon" asChild className="touch-manipulation">
          <Link href="/routines">
            <X className="h-6 w-6" />
          </Link>
        </Button>
        <h1 className="text-lg font-semibold text-foreground">New Routine</h1>
        <div></div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Routine Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Routine Name</label>
          <Input
            type="text"
            placeholder="Enter routine name"
            value={routineName}
            onChange={(e) => setRoutineName(e.target.value)}
            className="h-12 text-base bg-input border-border rounded-lg touch-manipulation"
          />
        </div>

        {/* Time Schedule */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Schedule Time</label>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 flex-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                value={routineTime}
                onChange={(e) => setRoutineTime(e.target.value)}
                className="h-12 text-base bg-input border-border rounded-lg touch-manipulation"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRoutineTime(getDefaultTime())}
              className="touch-manipulation"
            >
              Default
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {routineType === "morning" ? "Recommended: 7:00 AM - 9:00 AM" : "Recommended: 8:00 PM - 10:00 PM"}
          </p>
        </div>

        {/* Enable/Disable */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Status</label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enabled"
              checked={isEnabled}
              onCheckedChange={(checked) => setIsEnabled(checked as boolean)}
            />
            <label htmlFor="enabled" className="text-sm text-foreground">
              Enable routine notifications
            </label>
          </div>
        </div>

        {/* Conflicts Warning */}
        {conflicts.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-yellow-800 mb-2 text-sm">Product Conflicts Detected</h3>
                  <ul className="space-y-1">
                    {conflicts.map((conflict, index) => (
                      <li key={index} className="text-xs text-yellow-700">
                        • {conflict}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Products</h2>
          <div className="space-y-3">
            {AVAILABLE_PRODUCTS.map((product) => {
              const isSelected = selectedProducts.includes(product.id)
              const hasWarning = product.warning && isSelected

              return (
                <Card
                  key={product.id}
                  className={`cursor-pointer transition-colors touch-manipulation ${
                    isSelected ? "bg-accent/50 border-primary/50" : "hover:bg-accent/30"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={`product-${product.id}`}
                        checked={isSelected}
                        onCheckedChange={(checked) => handleProductToggle(product.id, checked as boolean)}
                      />
                      <div className="w-12 h-12 bg-secondary rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-card-foreground text-sm">{product.name}</h3>
                          {hasWarning && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                        </div>
                        <Badge className={`${getCategoryColor(product.category)} text-xs`} variant="outline">
                          {product.category}
                        </Badge>
                        {hasWarning && <p className="text-xs text-yellow-600 mt-1">{product.warning}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button onClick={handleSaveRoutine} className="w-full h-12 text-base font-medium touch-manipulation">
          Save Routine
        </Button>
      </div>
    </div>
  )
}
