"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { BottomNavigation } from "@/components/bottom-navigation"
import { useApp } from "@/components/app-context"
import { useTheme } from "next-themes"
import { 
  Settings,
  User,
  Lock,
  Accessibility,
  Palette,
  Globe,
  Bell,
  Watch,
  Video,
  ChevronRight,
  Moon,
  Sun,
  LogOut,
  Shield,
  Vibrate,
  Volume2
} from "lucide-react"

interface SettingItemProps {
  icon: typeof Settings
  title: string
  description?: string
  onClick?: () => void
  trailing?: React.ReactNode
}

function SettingItem({ icon: Icon, title, description, onClick, trailing }: SettingItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors text-left"
      aria-label={title}
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-foreground">{title}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {trailing || <ChevronRight className="w-5 h-5 text-muted-foreground" />}
    </button>
  )
}

export function SettingsScreen() {
  const { setScreen, setIsAuthenticated } = useApp()
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const [vibrationIntensity, setVibrationIntensity] = useState([70])
  const [soundAlerts, setSoundAlerts] = useState(true)

  const handleLogout = () => {
    localStorage.removeItem("babycare-auth")
    setIsAuthenticated(false)
    setScreen("login")
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-border/50 safe-top">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your preferences</p>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <User className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground">Parent User</h2>
                  <p className="text-muted-foreground">parent@babycare.app</p>
                  <Badge variant="secondary" className="mt-2">Premium Plan</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Account</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <SettingItem
                icon={User}
                title="Edit Profile"
                description="Name, photo, contact info"
              />
              <SettingItem
                icon={Lock}
                title="Change Password"
                description="Update your password"
              />
              <SettingItem
                icon={Shield}
                title="Privacy & Security"
                description="Two-factor authentication"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Accessibility Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Accessibility className="w-5 h-5" />
                Accessibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">Large Text</p>
                  <p className="text-sm text-muted-foreground">Increase font sizes</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">High Contrast</p>
                  <p className="text-sm text-muted-foreground">Enhance visibility</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">Screen Reader</p>
                  <p className="text-sm text-muted-foreground">VoiceOver compatible</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Theme Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  onClick={() => setTheme("light")}
                  className="flex-1 h-20 rounded-xl flex-col gap-2"
                >
                  <Sun className="w-6 h-6" />
                  <span>Light</span>
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  onClick={() => setTheme("dark")}
                  className="flex-1 h-20 rounded-xl flex-col gap-2"
                >
                  <Moon className="w-6 h-6" />
                  <span>Dark</span>
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  onClick={() => setTheme("system")}
                  className="flex-1 h-20 rounded-xl flex-col gap-2"
                >
                  <Settings className="w-6 h-6" />
                  <span>Auto</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive alerts on phone</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">Sound Alerts</p>
                  <p className="text-sm text-muted-foreground">Play sound for alerts</p>
                </div>
                <Switch checked={soundAlerts} onCheckedChange={setSoundAlerts} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Smartband Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Watch className="w-5 h-5" />
                Smartband
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Vibrate className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">Vibration Intensity</span>
                  </div>
                  <span className="text-muted-foreground">{vibrationIntensity[0]}%</span>
                </div>
                <Slider
                  value={vibrationIntensity}
                  onValueChange={setVibrationIntensity}
                  max={100}
                  step={10}
                  className="w-full"
                  aria-label="Vibration intensity"
                />
              </div>
              
              <SettingItem
                icon={Watch}
                title="Manage Smartband"
                description="Pair, unpair, or configure"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Camera Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Video className="w-5 h-5" />
                Camera
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <SettingItem
                icon={Video}
                title="Camera Preferences"
                description="Quality, night mode, storage"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Other Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Other</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <SettingItem
                icon={Globe}
                title="Language"
                description="English"
              />
              <SettingItem
                icon={Shield}
                title="About BabyCare"
                description="Version 1.0.0"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full h-16 text-lg rounded-2xl border-destructive text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </Button>
        </motion.div>
      </main>

      <BottomNavigation />
    </div>
  )
}
