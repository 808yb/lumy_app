"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Scan, X, Flashlight } from "lucide-react"
import Link from "next/link"
import { BottomNavigation } from "@/components/bottom-navigation"
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser"

const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: "CeraVe Hydrating Cleanser",
    brand: "CeraVe",
    image: "/cerave-cleanser.png",
    category: "Cleanser",
  },
  {
    id: 2,
    name: "The Ordinary Niacinamide 10% + Zinc 1%",
    brand: "The Ordinary",
    image: "/ordinary-niacinamide.png",
    category: "Serum",
  },
  {
    id: 3,
    name: "Neutrogena Ultra Gentle Daily Cleanser",
    brand: "Neutrogena",
    image: "/neutrogena-cleanser.png",
    category: "Cleanser",
  },
  {
    id: 4,
    name: "La Roche-Posay Toleriane Double Repair Moisturizer",
    brand: "La Roche-Posay",
    image: "/laroche-moisturizer.png",
    category: "Moisturizer",
  },
]

export default function ScanPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<typeof SAMPLE_PRODUCTS>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [torchOn, setTorchOn] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const scannerControlsRef = useRef<IScannerControls | null>(null)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      setIsSearching(true)
      // Simulate search delay
      setTimeout(() => {
        const results = SAMPLE_PRODUCTS.filter(
          (product) =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.brand.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase()),
        )
        setSearchResults(results)
        setIsSearching(false)
      }, 500)
    } else {
      setSearchResults([])
      setIsSearching(false)
    }
  }

  const startScanner = async () => {
    setCameraError(null)
    setIsScanning(true)
    // Must be called in a user gesture on iOS
    try {
      const codeReader = new BrowserMultiFormatReader()
      // Prefer back camera
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: "environment" },
          // iOS requires exact width/height hints to select better camera stream
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      }

      const controls = await codeReader.decodeFromVideoDevice(
        undefined,
        videoRef.current!,
        (result, err, controls) => {
          if (result) {
            // Stop immediately after a successful scan
            controls.stop()
            scannerControlsRef.current = null
            setIsScanning(false)
            const text = result.getText()
            // Navigate to a product by barcode; for demo, use id=1
            window.location.href = `/product/1?barcode=${encodeURIComponent(text)}`
          }
        },
        constraints
      )
      scannerControlsRef.current = controls
    } catch (e: any) {
      console.error(e)
      setCameraError(
        e?.message || "Unable to access camera. Please allow camera permissions and try again."
      )
      setIsScanning(false)
    }
  }

  const stopScanner = () => {
    scannerControlsRef.current?.stop()
    scannerControlsRef.current = null
    setIsScanning(false)
  }

  // Best effort torch toggle (Android Chrome mostly; iOS supports only on some devices)
  const toggleTorch = async () => {
    try {
      const track = videoRef.current?.srcObject && (videoRef.current.srcObject as MediaStream).getVideoTracks?.()[0]
      if (!track) return
      // @ts-ignore: ImageCapture exists in browsers
      const imageCapture = new window.ImageCapture(track)
      const capabilities = await imageCapture.getPhotoCapabilities?.()
      if (capabilities?.fillLightMode?.includes?.("flash")) {
        // @ts-ignore: applyConstraints torch
        await track.applyConstraints({ advanced: [{ torch: !torchOn }] })
        setTorchOn(!torchOn)
      }
    } catch (err) {
      console.warn("Torch toggle not supported", err)
    }
  }

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      stopScanner()
    }
  }, [])

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
  }

  return (
    <div className="h-full bg-background flex flex-col page-with-bottom-nav">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-safe border-b border-border">
        <h1 className="text-lg font-semibold text-foreground">Scan Product</h1>
        {searchQuery && (
          <Button variant="ghost" size="icon" onClick={clearSearch} className="touch-manipulation">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {!searchQuery ? (
          /* Initial State - Search or Scan */
          <div className="flex flex-col items-center justify-center h-full space-y-8 max-w-sm mx-auto">
            {/* Search Input */}
            <div className="w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for a product"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-12 pl-10 text-base bg-input border-border rounded-lg touch-manipulation"
              />
            </div>

            {/* Divider */}
            <div className="flex items-center w-full">
              <div className="flex-1 border-t border-border"></div>
              <span className="px-4 text-muted-foreground text-sm">Or</span>
              <div className="flex-1 border-t border-border"></div>
            </div>

            {/* Scan Button */}
            {!isScanning ? (
              <Button onClick={startScanner} className="w-full h-12 text-base font-medium touch-manipulation" size="lg">
                <Scan className="mr-2 h-5 w-5" />
                Start Scanner
              </Button>
            ) : (
              <Button onClick={stopScanner} variant="outline" className="w-full h-12 text-base font-medium touch-manipulation" size="lg">
                <X className="mr-2 h-5 w-5" />
                Stop Scanner
              </Button>
            )}

            {/* Camera Preview */}
            {isScanning && (
              <div className="w-full rounded-xl overflow-hidden border border-border">
                <video
                  ref={videoRef}
                  className="w-full aspect-[3/4] bg-black"
                  playsInline
                  muted
                  autoPlay
                />
                <div className="flex items-center justify-between p-2 bg-background/70">
                  <span className="text-xs text-muted-foreground">Aim the barcode within the frame</span>
                  <Button size="icon" variant="ghost" onClick={toggleTorch} className="touch-manipulation">
                    <Flashlight className={`h-5 w-5 ${torchOn ? 'text-primary' : 'text-foreground'}`} />
                  </Button>
                </div>
              </div>
            )}

            {/* iOS-specific tips / errors */}
            {cameraError && (
              <div className="text-center text-sm text-destructive">
                {cameraError}
              </div>
            )}
          </div>
        ) : (
          /* Search Results */
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for a product"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-12 pl-10 text-base bg-input border-border rounded-lg touch-manipulation"
              />
            </div>

            {isSearching ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2 text-sm">Searching products...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{searchResults.length} products found</p>
                {searchResults.map((product) => (
                  <Card key={product.id} className="cursor-pointer hover:bg-accent/50 transition-colors touch-manipulation">
                    <CardContent className="p-4">
                      <Link href={`/product/${product.id}`} className="flex items-center space-x-3">
                        <div className="w-14 h-14 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-card-foreground text-sm truncate">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.brand}</p>
                          <p className="text-xs text-muted-foreground mt-1">{product.category}</p>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">No products found for "{searchQuery}"</p>
                <p className="text-xs text-muted-foreground mt-2">Try a different search term</p>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNavigation currentPage="scan" />
    </div>
  )
}
