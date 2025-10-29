"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Settings, ChevronRight } from "lucide-react"
import Link from "next/link"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function ProfilePage() {
  const [user] = useState({
    name: "Olivia Bennett",
    age: 24,
    membershipType: "Premium Member",
    avatar: "",
    skinType: "Combination",
    allergies: "None",
    brandPreferences: "Cruelty-free",
    ingredientPreferences: "Fragrance-free",
  })

  return (
    <div className="h-full bg-background flex flex-col page-with-bottom-nav">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-safe border-b border-border">
        <h1 className="text-lg font-semibold text-foreground">Profile</h1>
        <Button variant="ghost" size="icon" asChild className="touch-manipulation">
          <Link href="/settings">
            <Settings className="h-5 w-5 text-foreground" />
          </Link>
        </Button>
      </div>

      {/* Profile Content */}
      <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        {/* User Info */}
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-lg bg-secondary text-secondary-foreground">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
            <p className="text-primary font-medium text-sm">{user.membershipType}</p>
          </div>
        </div>

        {/* Profile Sections */}
        <div className="space-y-4">
          {/* Skin Type */}
          <div className="bg-card rounded-lg p-4">
            <h3 className="text-base font-semibold text-card-foreground mb-3">Skin Type</h3>
            <Button variant="ghost" className="w-full justify-between h-auto p-0 hover:bg-transparent touch-manipulation" asChild>
              <Link href="/profile/skin-type">
                <div className="text-left">
                  <p className="font-medium text-card-foreground text-sm">Skin Type</p>
                  <p className="text-muted-foreground text-sm">{user.skinType}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              </Link>
            </Button>
          </div>

          {/* Allergies */}
          <div className="bg-card rounded-lg p-4">
            <h3 className="text-base font-semibold text-card-foreground mb-3">Allergies</h3>
            <Button variant="ghost" className="w-full justify-between h-auto p-0 hover:bg-transparent touch-manipulation" asChild>
              <Link href="/profile/allergies">
                <div className="text-left">
                  <p className="font-medium text-card-foreground text-sm">Allergies</p>
                  <p className="text-muted-foreground text-sm">{user.allergies}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              </Link>
            </Button>
          </div>

          {/* Preferences */}
          <div className="bg-card rounded-lg p-4">
            <h3 className="text-base font-semibold text-card-foreground mb-3">Preferences</h3>
            <div className="space-y-4">
              <Button variant="ghost" className="w-full justify-between h-auto p-0 hover:bg-transparent touch-manipulation" asChild>
                <Link href="/profile/brand-preferences">
                  <div className="text-left">
                    <p className="font-medium text-card-foreground text-sm">Brand Preferences</p>
                    <p className="text-muted-foreground text-sm">{user.brandPreferences}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </Link>
              </Button>

              <Button variant="ghost" className="w-full justify-between h-auto p-0 hover:bg-transparent touch-manipulation" asChild>
                <Link href="/profile/ingredient-preferences">
                  <div className="text-left">
                    <p className="font-medium text-card-foreground text-sm">Ingredient Preferences</p>
                    <p className="text-muted-foreground text-sm">{user.ingredientPreferences}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation currentPage="profile" />
    </div>
  )
}
