"use client"

import React, { useState, useEffect } from "react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Trash2 } from "lucide-react"
import Link from "next/link"

export default function LibraryPage() {
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load favorite products from localStorage
  const loadFavoriteProducts = () => {
    if (typeof window !== 'undefined') {
      const favorites = localStorage.getItem('carefulapp-favorite-products')
      return favorites ? JSON.parse(favorites) : []
    }
    return []
  }

  // Remove product from favorites
  const removeProduct = (productId: number) => {
    if (typeof window !== 'undefined') {
      const updatedProducts = favoriteProducts.filter(p => p.id !== productId)
      setFavoriteProducts(updatedProducts)
      localStorage.setItem('carefulapp-favorite-products', JSON.stringify(updatedProducts))
      console.log('Product removed from favorites')
    }
  }

  // Load products on component mount
  useEffect(() => {
    const products = loadFavoriteProducts()
    setFavoriteProducts(products)
    setIsLoaded(true)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }
  return (
    <div className="h-full bg-background flex flex-col page-with-bottom-nav">
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Library</h1>
            <p className="text-muted-foreground mt-2">
              Access your favorite products, routines, and resources
            </p>
          </div>

          <div className="grid gap-6">
            {/* Favorite Products Section */}
            <div className="bg-card rounded-lg p-6 border">
              <h2 className="text-xl font-semibold mb-4">Favorite Products</h2>
              {!isLoaded ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Loading favorite products...</p>
                </div>
              ) : favoriteProducts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No favorite products yet</p>
                  <p className="text-sm mt-1">Products you favorite will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {favoriteProducts.map((product) => (
                    <Card key={product.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                      <CardContent className="p-4">
                        <Link href={`/product/${product.id}`} className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-secondary rounded-lg overflow-hidden flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-card-foreground truncate">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">{product.brand}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                                <span className="text-sm font-medium text-foreground">{product.price}</span>
                              </div>
                              <span className={`text-sm font-medium ${getScoreColor(product.personalizedScore.score)}`}>
                                {product.personalizedScore.score}/100
                              </span>
                            </div>
                          </div>
                        </Link>
                        <div className="flex justify-end mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeProduct(product.id)
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Routines Section */}
            <div className="bg-card rounded-lg p-6 border">
              <h2 className="text-xl font-semibold mb-4">Saved Routines</h2>
              <div className="text-center py-8 text-muted-foreground">
                <p>No saved routines yet</p>
                <p className="text-sm mt-1">Routines you create will appear here</p>
              </div>
            </div>

            {/* Resources Section */}
            <div className="bg-card rounded-lg p-6 border">
              <h2 className="text-xl font-semibold mb-4">Resources</h2>
              <div className="text-center py-8 text-muted-foreground">
                <p>No resources available</p>
                <p className="text-sm mt-1">Helpful guides and tips will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation currentPage="library" />
    </div>
  )
}
