"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, Heart, Share, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

const SAMPLE_PRODUCT = {
  id: 1,
  name: "CeraVe Hydrating Cleanser",
  brand: "CeraVe",
  image: "/cerave-cleanser.png",
  category: "Cleanser",
  price: "$12.99",
  rating: 4.5,
  personalizedScore: {
    status: "safe",
    score: 85,
    message: "Great match for your combination skin!",
  },
  keyIngredients: [
    {
      name: "Ceramides",
      purpose: "Barrier repair",
      safety: "safe",
      description: "Help restore and maintain the skin's natural barrier",
    },
    {
      name: "Hyaluronic Acid",
      purpose: "Hydration",
      safety: "safe",
      description: "Attracts and retains moisture in the skin",
    },
    {
      name: "Niacinamide",
      purpose: "Skin conditioning",
      safety: "safe",
      description: "Helps improve skin texture and minimize pores",
    },
  ],
  allIngredients: [
    "Water",
    "Glycerin",
    "Ceramide NP",
    "Ceramide AP",
    "Ceramide EOP",
    "Carbomer",
    "Dimethicone",
    "Cetearyl Alcohol",
    "Behentrimonium Methosulfate",
    "Sodium Lauroyl Lactylate",
    "Sodium Hyaluronate",
    "Cholesterol",
    "Phenoxyethanol",
    "Disodium EDTA",
    "Dipotassium Phosphate",
    "Sodium Phosphate",
    "Tocopherol",
    "Phytosphingosine",
    "Xanthan Gum",
    "Ethylhexylglycerin",
  ],
  alternatives: [
    {
      id: 2,
      name: "Neutrogena Ultra Gentle Daily Cleanser",
      brand: "Neutrogena",
      price: "$8.99",
      score: 82,
      image: "/neutrogena-cleanser.png",
    },
    {
      id: 3,
      name: "La Roche-Posay Toleriane Caring Wash",
      brand: "La Roche-Posay",
      price: "$15.99",
      score: 88,
      image: "/laroche-cleanser.png",
    },
  ],
}

export default function ProductPage() {
  const params = useParams()
  const [isFavorited, setIsFavorited] = useState(false)
  const product = SAMPLE_PRODUCT // In real app, fetch by params.id
  const { toast } = useToast()

  // Load favorite products from localStorage
  const getFavoriteProducts = () => {
    if (typeof window !== 'undefined') {
      const favorites = localStorage.getItem('carefulapp-favorite-products')
      return favorites ? JSON.parse(favorites) : []
    }
    return []
  }

  // Save product to favorites
  const addToFavorites = (productToSave: any) => {
    if (typeof window !== 'undefined') {
      const favoriteProducts = getFavoriteProducts()
      const existingIndex = favoriteProducts.findIndex((p: any) => p.id === productToSave.id)
      
      if (existingIndex === -1) {
        // Add new product
        const newFavoriteProducts = [...favoriteProducts, productToSave]
        localStorage.setItem('carefulapp-favorite-products', JSON.stringify(newFavoriteProducts))
        console.log(`Product "${productToSave.name}" added to favorites`)
        
        // Show success toast
        toast({
          title: "Added to Favorites! ❤️",
          description: `${productToSave.name} has been added to your favorites.`,
          duration: 3000,
          variant: "success",
        })
      }
    }
  }

  // Remove product from favorites
  const removeFromFavorites = (productId: number) => {
    if (typeof window !== 'undefined') {
      const favoriteProducts = getFavoriteProducts()
      const filteredProducts = favoriteProducts.filter((p: any) => p.id !== productId)
      localStorage.setItem('carefulapp-favorite-products', JSON.stringify(filteredProducts))
      console.log(`Product removed from favorites`)
      
      // Show removal toast
      toast({
        title: "Removed from Favorites",
        description: "Product has been removed from your favorites.",
        duration: 3000,
        variant: "success",
      })
    }
  }

  // Check if product is favorited on component mount
  React.useEffect(() => {
    const favoriteProducts = getFavoriteProducts()
    const isFavorited = favoriteProducts.some((p: any) => p.id === product.id)
    setIsFavorited(isFavorited)
  }, [product.id])

  // Handle heart click
  const handleHeartClick = () => {
    if (isFavorited) {
      removeFromFavorites(product.id)
      setIsFavorited(false)
    } else {
      addToFavorites(product)
      setIsFavorited(true)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-primary"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreIcon = (status: string) => {
    switch (status) {
      case "safe":
        return <CheckCircle className="h-5 w-5 text-primary" />
      case "caution":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "avoid":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <CheckCircle className="h-5 w-5 text-primary" />
    }
  }

  const getSafetyBadge = (safety: string) => {
    const variants = {
      safe: "bg-secondary text-primary border-border",
      caution: "bg-yellow-100 text-yellow-800 border-yellow-200",
      avoid: "bg-red-100 text-red-800 border-red-200",
    }
    return variants[safety as keyof typeof variants] || variants.safe
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/scan">
            <ChevronLeft className="h-6 w-6" />
          </Link>
        </Button>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleHeartClick}
            className={isFavorited ? "text-red-500" : "text-muted-foreground"}
          >
            <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
          </Button>
          <Button variant="ghost" size="icon">
            <Share className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Product Header */}
        <div className="flex space-x-4">
          <div className="w-24 h-24 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 space-y-2">
            <h1 className="text-xl font-semibold text-foreground text-balance">{product.name}</h1>
            <p className="text-muted-foreground">{product.brand}</p>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{product.category}</Badge>
              <span className="text-lg font-semibold text-foreground">{product.price}</span>
            </div>
          </div>
        </div>

        {/* Personalized Score */}
        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              {getScoreIcon(product.personalizedScore.status)}
              <span>Your Personalized Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-foreground">{product.personalizedScore.score}/100</span>
              <Badge className={getSafetyBadge(product.personalizedScore.status)}>
                {product.personalizedScore.status.toUpperCase()}
              </Badge>
            </div>
            <p className="text-muted-foreground">{product.personalizedScore.message}</p>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="ingredients" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
          </TabsList>

          <TabsContent value="ingredients" className="space-y-4 mt-6">
            {/* Key Ingredients */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Key Ingredients</h3>
              {product.keyIngredients.map((ingredient, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-card-foreground">{ingredient.name}</h4>
                      <Badge className={getSafetyBadge(ingredient.safety)} variant="outline">
                        {ingredient.safety}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{ingredient.purpose}</p>
                    <p className="text-sm text-muted-foreground">{ingredient.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* All Ingredients */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Full Ingredient List</h3>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{product.allIngredients.join(", ")}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Why This Score?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-card-foreground">Perfect for Combination Skin</p>
                      <p className="text-sm text-muted-foreground">
                        Contains ceramides and hyaluronic acid that balance oily and dry areas
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-card-foreground">Fragrance-Free</p>
                      <p className="text-sm text-muted-foreground">
                        Matches your preference for fragrance-free products
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-card-foreground">Gentle Formula</p>
                      <p className="text-sm text-muted-foreground">Non-comedogenic and suitable for sensitive areas</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alternatives" className="space-y-4 mt-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Similar Products You Might Like</h3>
              {product.alternatives.map((alt) => (
                <Card key={alt.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardContent className="p-4">
                    <Link href={`/product/${alt.id}`} className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={alt.image || "/placeholder.svg"}
                          alt={alt.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-card-foreground truncate">{alt.name}</h4>
                        <p className="text-sm text-muted-foreground">{alt.brand}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-medium text-foreground">{alt.price}</span>
                          <span className={`text-sm font-medium ${getScoreColor(alt.score)}`}>
                            Score: {alt.score}/100
                          </span>
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Button */}
        <Button className="w-full h-14 text-base font-medium">Add to Routine</Button>
      </div>
      <Toaster />
    </div>
  )
}
