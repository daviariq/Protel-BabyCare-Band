"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/components/app-context"
import { 
  Wifi, 
  WifiOff,
  Watch,
  Video,
  Cpu,
  Plus,
  CheckCircle,
  Loader2,
  ChevronRight,
  ArrowLeft,
  Signal,
  SignalHigh,
  SignalLow,
  RefreshCw
} from "lucide-react"

interface Device {
  id: string
  name: string
  type: "smartband" | "camera" | "raspberryPi" | "esp32"
  status: "connected" | "available" | "pairing"
  signal?: number
}

const availableDevices: Device[] = [
  { id: "1", name: "BabyCare Smartband", type: "smartband", status: "available", signal: 85 },
  { id: "2", name: "Living Room Camera", type: "camera", status: "available", signal: 92 },
  { id: "3", name: "Raspberry Pi Hub", type: "raspberryPi", status: "available", signal: 95 },
  { id: "4", name: "ESP32 Sensor", type: "esp32", status: "available", signal: 78 },
]

const connectedDevices: Device[] = [
  { id: "c1", name: "Parent Smartband", type: "smartband", status: "connected" },
  { id: "c2", name: "Baby Camera", type: "camera", status: "connected" },
  { id: "c3", name: "Main Controller", type: "raspberryPi", status: "connected" },
]

const deviceIcons = {
  smartband: Watch,
  camera: Video,
  raspberryPi: Cpu,
  esp32: Cpu,
}

const deviceColors = {
  smartband: "bg-accent/30",
  camera: "bg-primary/20",
  raspberryPi: "bg-secondary/50",
  esp32: "bg-warning/20",
}

export function DevicePairingScreen() {
  const { setScreen } = useApp()
  const [isScanning, setIsScanning] = useState(false)
  const [devices, setDevices] = useState(availableDevices)
  const [pairingDevice, setPairingDevice] = useState<string | null>(null)

  const handleScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
    }, 3000)
  }

  const handlePair = (deviceId: string) => {
    setPairingDevice(deviceId)
    setDevices(devices.map(d => 
      d.id === deviceId ? { ...d, status: "pairing" as const } : d
    ))
    
    setTimeout(() => {
      setDevices(devices.map(d => 
        d.id === deviceId ? { ...d, status: "connected" as const } : d
      ))
      setPairingDevice(null)
    }, 3000)
  }

  const getSignalIcon = (signal?: number) => {
    if (!signal) return Signal
    if (signal > 80) return SignalHigh
    if (signal > 50) return Signal
    return SignalLow
  }

  return (
    <div className="min-h-screen bg-background safe-top safe-bottom">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-border/50">
        <div className="flex items-center gap-4 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setScreen("home")}
            className="w-12 h-12 rounded-full"
            aria-label="Go back to home"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Device Pairing</h1>
            <p className="text-muted-foreground">Connect your IoT devices</p>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Connected Devices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wifi className="w-5 h-5 text-secondary" />
                Connected Devices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {connectedDevices.map((device) => {
                const Icon = deviceIcons[device.type]
                
                return (
                  <div
                    key={device.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/50"
                  >
                    <div className={`w-12 h-12 rounded-full ${deviceColors[device.type]} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{device.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{device.type}</p>
                    </div>
                    <Badge variant="default" className="bg-secondary text-secondary-foreground">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Scan Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            onClick={handleScan}
            disabled={isScanning}
            className="w-full h-16 text-lg rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                Scanning for devices...
              </>
            ) : (
              <>
                <RefreshCw className="w-6 h-6 mr-2" />
                Scan for Devices
              </>
            )}
          </Button>
        </motion.div>

        {/* Scanning Animation */}
        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center py-8"
          >
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 w-24 h-24 rounded-full bg-primary/30"
              />
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute inset-0 w-24 h-24 rounded-full bg-primary/20"
              />
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
                <Wifi className="w-12 h-12 text-primary-foreground animate-pulse" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Available Devices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Available Devices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {devices.map((device) => {
                const Icon = deviceIcons[device.type]
                const SignalIcon = getSignalIcon(device.signal)
                const isPairing = device.status === "pairing"
                const isConnected = device.status === "connected"
                
                return (
                  <motion.div
                    key={device.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/50"
                  >
                    <div className={`w-12 h-12 rounded-full ${deviceColors[device.type]} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{device.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <SignalIcon className="w-4 h-4" />
                        <span>{device.signal}% signal</span>
                      </div>
                    </div>
                    
                    {isConnected ? (
                      <Badge variant="default" className="bg-secondary text-secondary-foreground">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Paired
                      </Badge>
                    ) : isPairing ? (
                      <Badge variant="secondary">
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Pairing...
                      </Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePair(device.id)}
                        className="rounded-full"
                      >
                        Pair
                      </Button>
                    )}
                  </motion.div>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg bg-primary/5">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
              <p className="text-muted-foreground mb-4">
                Make sure your devices are powered on and in pairing mode. Keep them within 10 meters for best results.
              </p>
              <Button variant="outline" className="rounded-xl">
                View Setup Guide
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
