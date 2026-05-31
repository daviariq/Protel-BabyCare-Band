"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Screen = 
  | "splash"
  | "onboarding"
  | "login"
  | "register"
  | "forgot-password"
  | "home"
  | "camera"
  | "analytics"
  | "notifications"
  | "settings"
  | "device-pairing"

interface AppState {
  currentScreen: Screen
  setScreen: (screen: Screen) => void
  isAuthenticated: boolean
  setIsAuthenticated: (value: boolean) => void
  showEmergencyAlert: boolean
  setShowEmergencyAlert: (value: boolean) => void
  babyStatus: {
    status: "safe" | "hungry" | "discomfort"
    lastActivity: string
    temperature: number
  }
  setBabyStatus: (status: AppState["babyStatus"]) => void
  devices: {
    smartband: { connected: boolean; battery: number }
    camera: { connected: boolean }
    raspberryPi: { connected: boolean }
  }
  setDevices: (devices: AppState["devices"]) => void
}

const AppContext = createContext<AppState | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false)
  const [babyStatus, setBabyStatus] = useState<AppState["babyStatus"]>({
    status: "safe",
    lastActivity: "Sleeping peacefully",
    temperature: 36.5,
  })
  const [devices, setDevices] = useState<AppState["devices"]>({
    smartband: { connected: true, battery: 85 },
    camera: { connected: true },
    raspberryPi: { connected: true },
  })

  const setScreen = (screen: Screen) => {
    setCurrentScreen(screen)
  }

  // Simulate splash screen
  useEffect(() => {
    if (currentScreen === "splash") {
      const timer = setTimeout(() => {
        const hasSeenOnboarding = localStorage.getItem("babycare-onboarding")
        const isLoggedIn = localStorage.getItem("babycare-auth")
        
        if (isLoggedIn) {
          setIsAuthenticated(true)
          setScreen("home")
        } else if (hasSeenOnboarding) {
          setScreen("login")
        } else {
          setScreen("onboarding")
        }
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [currentScreen])

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setScreen,
        isAuthenticated,
        setIsAuthenticated,
        showEmergencyAlert,
        setShowEmergencyAlert,
        babyStatus,
        setBabyStatus,
        devices,
        setDevices,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
