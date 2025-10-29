import Link from "next/link"
import { Home, Library, Plus, List, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomNavigationProps {
  currentPage: "home" | "library" | "scan" | "routines" | "profile"
}

export function BottomNavigation({ currentPage }: BottomNavigationProps) {
  const navItems = [
    { id: "home", label: "Home", icon: Home, href: "/home" },
    { id: "library", label: "Library", icon: Library, href: "/library" },
    { id: "scan", label: "Scan", icon: Plus, href: "/scan", isAction: true },
    { id: "routines", label: "Routines", icon: List, href: "/routines" },
    { id: "profile", label: "Profile", icon: User, href: "/profile" },
  ]

  return (
    <div className="bottom-nav-container">
      <div className="flex items-center justify-around py-2 px-2 pb-safe relative max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          const isActionButton = item.isAction

          if (isActionButton) {
            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex flex-col items-center justify-center py-3 px-4 rounded-full transition-all duration-200 min-h-[72px] min-w-[72px] touch-manipulation bg-primary hover:bg-primary/90 active:scale-95 -mt-8 shadow-lg"
              >
                <Icon className="h-8 w-8 text-primary-foreground" />
              </Link>
            )
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-3 px-4 rounded-xl transition-all duration-200 min-h-[44px] min-w-[44px] touch-manipulation",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50 active:scale-95",
              )}
            >
              <Icon className={cn(
                "h-6 w-6 mb-1 transition-transform duration-200",
                isActive && "scale-110"
              )} />
              <span className={cn(
                "text-xs font-medium transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
