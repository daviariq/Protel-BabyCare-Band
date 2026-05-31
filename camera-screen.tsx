"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BottomNavigation } from "@/components/bottom-navigation"
import { 
  Video, 
  Maximize2,
  Moon,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Camera,
  Play,
  Clock,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

const recentClips = [
  { id: 1, time: "10:30 AM", type: "Crying detected", duration: "0:45" },
  { id: 2, time: "9:15 AM", type: "Movement detected", duration: "1:20" },
  { id: 3, time: "8:00 AM", type: "Wake up", duration: "2:10" },
  { id: 4, time: "3:45 AM", type: "Crying detected", duration: "0:30" },
]

export function CameraScreen() {
  const [isLive, setIsLive] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isMicOn, setIsMicOn] = useState(false)
  const [isNightMode, setIsNightMode] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-border/50 safe-top">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold text-foreground">Camera Monitor</h1>
          <Badge variant={isLive ? "default" : "secondary"} className="bg-destructive text-destructive-foreground">
            <span className={`w-2 h-2 bg-white rounded-full mr-2 ${isLive ? "animate-pulse" : ""}`} />
            {isLive ? "Live" : "Paused"}
          </Badge>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Live Camera View */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className={`relative ${isFullscreen ? "fixed inset-0 z-50" : "aspect-video"}`}>
              {/* Camera Feed Placeholder */}
              <div className={`w-full h-full ${isNightMode ? "bg-slate-900" : "bg-gradient-to-br from-muted to-muted/50"} flex items-center justify-center`}>
                <div className="text-center">
                  <Video className={`w-16 h-16 mx-auto mb-4 ${isNightMode ? "text-green-400" : "text-muted-foreground"}`} />
                  <p className={`text-lg ${isNightMode ? "text-green-400" : "text-muted-foreground"}`}>
                    {isLive ? "Live Camera Feed" : "Camera Paused"}
                  </p>
                  {isNightMode && (
                    <Badge className="mt-2 bg-green-500/20 text-green-400">
                      <Moon className="w-3 h-3 mr-1" />
                      Night Vision
                    </Badge>
                  )}
                </div>
              </div>

              {/* Overlay Controls */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date().toLocaleTimeString()}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  <Maximize2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center justify-center gap-4 p-3 rounded-2xl bg-black/50 backdrop-blur-sm">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMuted(!isMuted)}
                    className="w-12 h-12 rounded-full text-white hover:bg-white/20"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsLive(!isLive)}
                    className={`w-16 h-16 rounded-full ${isLive ? "bg-destructive text-white" : "bg-white text-foreground"}`}
                    aria-label={isLive ? "Pause live feed" : "Start live feed"}
                  >
                    {isLive ? <Camera className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMicOn(!isMicOn)}
                    className="w-12 h-12 rounded-full text-white hover:bg-white/20"
                    aria-label={isMicOn ? "Turn off microphone" : "Turn on microphone"}
                  >
                    {isMicOn ? <Mic className="w-6 h-6 text-primary" /> : <MicOff className="w-6 h-6" />}
                  </Button>
                </div>
              </div>

              {/* Fullscreen close */}
              {isFullscreen && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullscreen(false)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white"
                  aria-label="Exit fullscreen"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Camera Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          <Button
            variant={isNightMode ? "default" : "outline"}
            onClick={() => setIsNightMode(!isNightMode)}
            className="h-16 rounded-2xl flex flex-col gap-1"
          >
            <Moon className="w-5 h-5" />
            <span className="text-xs">Night Mode</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-16 rounded-2xl flex flex-col gap-1"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="text-xs">Rotate</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-16 rounded-2xl flex flex-col gap-1"
          >
            <Camera className="w-5 h-5" />
            <span className="text-xs">Snapshot</span>
          </Button>
        </motion.div>

        {/* Recent Event Clips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-foreground">Recent Events</h2>
            <Button variant="ghost" className="text-primary">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {recentClips.map((clip, index) => (
              <motion.div
                key={clip.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="border-0 shadow-md">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-20 h-14 rounded-xl bg-muted flex items-center justify-center relative">
                      <Play className="w-6 h-6 text-muted-foreground" />
                      <Badge className="absolute -top-1 -right-1 text-xs bg-foreground text-background">
                        {clip.duration}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{clip.type}</p>
                      <p className="text-sm text-muted-foreground">{clip.time}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <BottomNavigation />
    </div>
  )
}
