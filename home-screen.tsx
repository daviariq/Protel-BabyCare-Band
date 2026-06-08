"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/components/app-context"
import { BottomNavigation } from "@/components/bottom-navigation"
import { 
  Baby, 
  Watch, 
  Video,
  Bell,
  BatteryMedium,
  Wifi,
  WifiOff,
  AlertCircle,
  Heart,
  Thermometer,
  Activity,
  ChevronRight,
  Plus,
  Moon
} from "lucide-react"

export function HomeScreen() {
  const { babyStatus, devices, setScreen, setShowEmergencyAlert } = useApp()

  const statusConfig = {
    safe: {
      color: "bg-secondary",
      textColor: "text-secondary-foreground",
      label: "All Good",
      icon: Heart,
    },
    hungry: {
      color: "bg-destructive",
      textColor: "text-destructive-foreground",
      label: "Hungry",
      icon: AlertCircle,
    },
    discomfort: {
      color: "bg-warning",
      textColor: "text-warning-foreground",
      label: "Discomfort",
      icon: AlertCircle,
    },
  }

  const status = statusConfig[babyStatus.status]
  const StatusIcon = status.icon

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-border/50 safe-top">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Hello, Parent</h1>
            <p className="text-muted-foreground">Your baby is being monitored</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full relative"
            onClick={() => setScreen("notifications")}
            aria-label="View notifications"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-3 h-3 bg-destructive rounded-full" />
          </Button>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Baby Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className={`${status.color} border-0 shadow-lg overflow-hidden`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <StatusIcon className={`w-6 h-6 ${status.textColor}`} />
                    <Badge variant="secondary" className="text-sm font-semibold bg-white/30 text-foreground">
                      {status.label}
                    </Badge>
                  </div>
                  <h2 className={`text-3xl font-bold ${status.textColor} mb-2`}>
                    Baby Status
                  </h2>
                  <p className={`text-lg ${status.textColor} opacity-90`}>
                    {babyStatus.lastActivity}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <Thermometer className={`w-5 h-5 ${status.textColor}`} />
                      <span className={`text-lg font-medium ${status.textColor}`}>
                        {babyStatus.temperature}°C
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className={`w-5 h-5 ${status.textColor}`} />
                      <span className={`text-lg font-medium ${status.textColor}`}>
                        Normal
                      </span>
                    </div>
                  </div>
                </div>
                
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 rounded-full bg-white/30 flex items-center justify-center"
                >
                  <Baby className={`w-10 h-10 ${status.textColor}`} strokeWidth={1.5} />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          {/* Camera Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card 
              className="border-0 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => setScreen("camera")}
            >
              <CardContent className="p-4">
                <div className="aspect-video rounded-xl bg-muted mb-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Video className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-destructive text-destructive-foreground text-xs">
                      <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
                      Live
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <Moon className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Camera</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Smartband Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="aspect-video rounded-xl bg-gradient-to-br from-accent/30 to-primary/30 mb-3 flex items-center justify-center">
                  <Watch className="w-10 h-10 text-foreground" strokeWidth={1.5} />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">Smartband</span>
                  {devices.smartband.connected ? (
                    <Wifi className="w-5 h-5 text-secondary" />
                  ) : (
                    <WifiOff className="w-5 h-5 text-destructive" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <BatteryMedium className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {devices.smartband.battery}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Connected Devices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Connected Devices</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setScreen("device-pairing")}
                  className="text-primary"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Video className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Baby Camera</p>
                    <p className="text-sm text-muted-foreground">Living Room</p>
                  </div>
                </div>
                <Badge variant={devices.camera.connected ? "default" : "destructive"} className="bg-secondary text-secondary-foreground">
                  {devices.camera.connected ? "Connected" : "Offline"}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/30 flex items-center justify-center">
                    <Watch className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Parent Smartband</p>
                    <p className="text-sm text-muted-foreground">Battery: {devices.smartband.battery}%</p>
                  </div>
                </div>
                <Badge variant={devices.smartband.connected ? "default" : "destructive"} className="bg-secondary text-secondary-foreground">
                  {devices.smartband.connected ? "Connected" : "Offline"}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Raspberry Pi Hub</p>
                    <p className="text-sm text-muted-foreground">Main Controller</p>
                  </div>
                </div>
                <Badge variant={devices.raspberryPi.connected ? "default" : "destructive"} className="bg-secondary text-secondary-foreground">
                  {devices.raspberryPi.connected ? "Connected" : "Offline"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Test Emergency Alert Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={() => setShowEmergencyAlert(true)}
            variant="outline"
            className="w-full h-14 text-lg rounded-2xl border-destructive text-destructive hover:bg-destructive/10"
          >
            <AlertCircle className="w-5 h-5 mr-2" />
            Test Emergency Alert
          </Button>
        </motion.div>
      </main>

      <BottomNavigation />
    </div>
  )
}
