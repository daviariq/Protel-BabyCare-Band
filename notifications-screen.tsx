"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BottomNavigation } from "@/components/bottom-navigation"
import { 
  Bell, 
  Search,
  Filter,
  AlertCircle,
  Video,
  Watch,
  Activity,
  CheckCircle,
  Clock,
  Trash2
} from "lucide-react"

type NotificationType = "cry" | "device" | "emergency" | "system"

interface Notification {
  id: number
  type: NotificationType
  title: string
  message: string
  time: string
  isRead: boolean
}

const notifications: Notification[] = [
  {
    id: 1,
    type: "cry",
    title: "Crying Detected",
    message: "Your baby may be hungry. Crying detected for 2 minutes.",
    time: "10 min ago",
    isRead: false,
  },
  {
    id: 2,
    type: "device",
    title: "Camera Connected",
    message: "Baby camera in the living room is now online.",
    time: "25 min ago",
    isRead: false,
  },
  {
    id: 3,
    type: "emergency",
    title: "Emergency Alert",
    message: "Baby was crying for extended period. Vibration alert sent to smartband.",
    time: "1 hour ago",
    isRead: true,
  },
  {
    id: 4,
    type: "system",
    title: "System Update",
    message: "BabyCare has been updated with improved AI detection.",
    time: "2 hours ago",
    isRead: true,
  },
  {
    id: 5,
    type: "cry",
    title: "Discomfort Detected",
    message: "Your baby may be uncomfortable. Consider checking diaper.",
    time: "3 hours ago",
    isRead: true,
  },
  {
    id: 6,
    type: "device",
    title: "Low Battery",
    message: "Smartband battery is at 20%. Please charge soon.",
    time: "5 hours ago",
    isRead: true,
  },
]

const typeConfig = {
  cry: {
    icon: AlertCircle,
    color: "bg-destructive/20 text-destructive",
  },
  device: {
    icon: Watch,
    color: "bg-primary/20 text-primary",
  },
  emergency: {
    icon: Bell,
    color: "bg-warning/20 text-warning",
  },
  system: {
    icon: Activity,
    color: "bg-secondary text-secondary-foreground",
  },
}

export function NotificationsScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | NotificationType>("all")
  const [notificationsList, setNotificationsList] = useState(notifications)

  const filteredNotifications = notificationsList.filter((notif) => {
    const matchesSearch = 
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === "all" || notif.type === filter
    return matchesSearch && matchesFilter
  })

  const unreadCount = notificationsList.filter(n => !n.isRead).length

  const markAllAsRead = () => {
    setNotificationsList(notificationsList.map(n => ({ ...n, isRead: true })))
  }

  const deleteNotification = (id: number) => {
    setNotificationsList(notificationsList.filter(n => n.id !== id))
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-border/50 safe-top">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
              <p className="text-muted-foreground">{unreadCount} unread alerts</p>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-primary"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pl-12 rounded-xl bg-muted border-0 text-lg"
              aria-label="Search notifications"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 px-4 pb-4 overflow-x-auto">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="rounded-full whitespace-nowrap"
          >
            All
          </Button>
          <Button
            variant={filter === "cry" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("cry")}
            className="rounded-full whitespace-nowrap"
          >
            <AlertCircle className="w-4 h-4 mr-1" />
            Cry Alerts
          </Button>
          <Button
            variant={filter === "device" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("device")}
            className="rounded-full whitespace-nowrap"
          >
            <Watch className="w-4 h-4 mr-1" />
            Devices
          </Button>
          <Button
            variant={filter === "emergency" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("emergency")}
            className="rounded-full whitespace-nowrap"
          >
            <Bell className="w-4 h-4 mr-1" />
            Emergency
          </Button>
        </div>
      </header>

      <main className="p-4">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Bell className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-foreground mb-2">No notifications</p>
            <p className="text-muted-foreground text-center">
              {"You're all caught up! We'll notify you when something happens."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification, index) => {
              const config = typeConfig[notification.type]
              const Icon = config.icon

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`border-0 shadow-md ${!notification.isRead ? "ring-2 ring-primary/20" : ""}`}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-full ${config.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {notification.title}
                                {!notification.isRead && (
                                  <span className="ml-2 w-2 h-2 bg-primary rounded-full inline-block" />
                                )}
                              </h3>
                              <p className="text-muted-foreground mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteNotification(notification.id)}
                              className="w-8 h-8 flex-shrink-0 text-muted-foreground hover:text-destructive"
                              aria-label="Delete notification"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{notification.time}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  )
}
