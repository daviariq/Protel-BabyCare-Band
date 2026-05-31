"use client"

import { useApp } from "@/components/app-context"
import { 
  Home, 
  Video, 
  BarChart3, 
  Bell, 
  Settings 
} from "lucide-react"

type Tab = "home" | "camera" | "analytics" | "notifications" | "settings"

const tabs: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "camera", label: "Camera", icon: Video },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "notifications", label: "Alerts", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
]

export function BottomNavigation() {
  const { currentScreen, setScreen } = useApp()

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-border/50 safe-bottom"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around h-20 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = currentScreen === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => setScreen(tab.id)}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all ${
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-xs mt-1 font-medium ${isActive ? "" : "sr-only sm:not-sr-only"}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
