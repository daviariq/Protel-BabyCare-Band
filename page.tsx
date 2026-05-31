"use client"

import { AppProvider, useApp } from "@/components/app-context"
import { SplashScreen } from "@/components/screens/splash-screen"
import { OnboardingScreen } from "@/components/screens/onboarding-screen"
import { LoginScreen } from "@/components/screens/login-screen"
import { RegisterScreen } from "@/components/screens/register-screen"
import { ForgotPasswordScreen } from "@/components/screens/forgot-password-screen"
import { HomeScreen } from "@/components/screens/home-screen"
import { CameraScreen } from "@/components/screens/camera-screen"
import { AnalyticsScreen } from "@/components/screens/analytics-screen"
import { NotificationsScreen } from "@/components/screens/notifications-screen"
import { SettingsScreen } from "@/components/screens/settings-screen"
import { DevicePairingScreen } from "@/components/screens/device-pairing-screen"
import { EmergencyAlert } from "@/components/emergency-alert"

function AppContent() {
  const { currentScreen } = useApp()

  const renderScreen = () => {
    switch (currentScreen) {
      case "splash":
        return <SplashScreen />
      case "onboarding":
        return <OnboardingScreen />
      case "login":
        return <LoginScreen />
      case "register":
        return <RegisterScreen />
      case "forgot-password":
        return <ForgotPasswordScreen />
      case "home":
        return <HomeScreen />
      case "camera":
        return <CameraScreen />
      case "analytics":
        return <AnalyticsScreen />
      case "notifications":
        return <NotificationsScreen />
      case "settings":
        return <SettingsScreen />
      case "device-pairing":
        return <DevicePairingScreen />
      default:
        return <SplashScreen />
    }
  }

  return (
    <div className="max-w-md mx-auto min-h-screen relative">
      {renderScreen()}
      <EmergencyAlert />
    </div>
  )
}

export default function BabyCareApp() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
