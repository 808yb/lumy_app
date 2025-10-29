"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

const SETUP_STEPS = [
  {
    id: "skin-type",
    title: "What's your skin type?",
    subtitle: "This helps us recommend the right products for you",
    options: [
      { value: "oily", label: "Oily", description: "Shiny, large pores, prone to breakouts" },
      { value: "dry", label: "Dry", description: "Tight, flaky, rough texture" },
      { value: "combination", label: "Combination", description: "Oily T-zone, dry cheeks" },
      { value: "sensitive", label: "Sensitive", description: "Easily irritated, reactive" },
      { value: "normal", label: "Normal", description: "Balanced, few concerns" },
    ],
  },
  {
    id: "concerns",
    title: "What are your main skin concerns?",
    subtitle: "Select all that apply",
    options: [
      { value: "acne", label: "Acne & Breakouts" },
      { value: "aging", label: "Anti-aging" },
      { value: "pigmentation", label: "Dark spots & Pigmentation" },
      { value: "rosacea", label: "Rosacea" },
      { value: "dryness", label: "Dryness" },
      { value: "sensitivity", label: "Sensitivity" },
    ],
  },
  {
    id: "preferences",
    title: "Any preferences?",
    subtitle: "Help us filter products for you",
    options: [
      { value: "cruelty-free", label: "Cruelty-free" },
      { value: "vegan", label: "Vegan" },
      { value: "fragrance-free", label: "Fragrance-free" },
      { value: "natural", label: "Natural ingredients" },
      { value: "sustainable", label: "Sustainable packaging" },
    ],
  },
]

export default function ProfileSetupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})

  const currentStepData = SETUP_STEPS[currentStep]
  const isLastStep = currentStep === SETUP_STEPS.length - 1

  const handleSingleSelect = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentStepData.id]: value,
    }))
  }

  const handleMultiSelect = (value: string, checked: boolean) => {
    setAnswers((prev) => {
      const currentValues = (prev[currentStepData.id] as string[]) || []
      if (checked) {
        return {
          ...prev,
          [currentStepData.id]: [...currentValues, value],
        }
      } else {
        return {
          ...prev,
          [currentStepData.id]: currentValues.filter((v) => v !== value),
        }
      }
    })
  }

  const handleNext = () => {
    if (isLastStep) {
      // Save profile and redirect to home
      console.log("Profile setup complete:", answers)
      router.push("/home")
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    } else {
      router.back()
    }
  }

  const canProceed = () => {
    const answer = answers[currentStepData.id]
    if (currentStepData.id === "concerns" || currentStepData.id === "preferences") {
      return true // These are optional
    }
    return answer && (Array.isArray(answer) ? answer.length > 0 : true)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="text-sm text-muted-foreground">
          {currentStep + 1} of {SETUP_STEPS.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 pb-6">
        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / SETUP_STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground text-balance">{currentStepData.title}</h1>
          <p className="text-muted-foreground text-balance">{currentStepData.subtitle}</p>
        </div>

        <div className="space-y-3">
          {currentStepData.id === "skin-type" ? (
            <RadioGroup
              value={(answers[currentStepData.id] as string) || ""}
              onValueChange={handleSingleSelect}
              className="space-y-3"
            >
              {currentStepData.options.map((option) => (
                <Card key={option.value} className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                      <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                        <div className="font-medium text-card-foreground">{option.label}</div>
                        {option.description && (
                          <div className="text-sm text-muted-foreground mt-1">{option.description}</div>
                        )}
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>
          ) : (
            <div className="space-y-3">
              {currentStepData.options.map((option) => (
                <Card key={option.value} className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={option.value}
                        checked={((answers[currentStepData.id] as string[]) || []).includes(option.value)}
                        onCheckedChange={(checked) => handleMultiSelect(option.value, checked as boolean)}
                      />
                      <Label htmlFor={option.value} className="flex-1 cursor-pointer font-medium text-card-foreground">
                        {option.label}
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4">
        <Button onClick={handleNext} disabled={!canProceed()} className="w-full h-14 text-base font-medium">
          {isLastStep ? "Complete Setup" : "Continue"}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
