import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="h-full bg-background flex flex-col items-center justify-center px-6 pt-safe pb-safe">
      <div className="text-center space-y-8 max-w-sm w-full">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-foreground">Lumy</h1>
          <p className="text-base text-muted-foreground text-balance leading-relaxed">
            Your personal skincare companion.
          </p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full h-12 text-base font-medium touch-manipulation">
            <Link href="/signup">Get Started</Link>
          </Button>

          <Button asChild variant="outline" className="w-full h-12 text-base font-medium bg-transparent touch-manipulation">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
