"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BottomNavigation } from "@/components/bottom-navigation"
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Utensils,
  Frown
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts"

const weeklyData = [
  { day: "Mon", hungry: 4, discomfort: 2 },
  { day: "Tue", hungry: 3, discomfort: 1 },
  { day: "Wed", hungry: 5, discomfort: 3 },
  { day: "Thu", hungry: 2, discomfort: 2 },
  { day: "Fri", hungry: 4, discomfort: 1 },
  { day: "Sat", hungry: 3, discomfort: 2 },
  { day: "Sun", hungry: 2, discomfort: 1 },
]

const monthlyData = [
  { week: "W1", total: 28 },
  { week: "W2", total: 22 },
  { week: "W3", total: 25 },
  { week: "W4", total: 18 },
]

const pieData = [
  { name: "Hungry", value: 65, color: "#FF9B9B" },
  { name: "Discomfort", value: 35, color: "#FFC37A" },
]

const activityTimeline = [
  { time: "10:30 AM", type: "Hungry", duration: "2 min" },
  { time: "8:15 AM", type: "Discomfort", duration: "5 min" },
  { time: "6:00 AM", type: "Hungry", duration: "3 min" },
  { time: "3:45 AM", type: "Hungry", duration: "4 min" },
  { time: "1:20 AM", type: "Discomfort", duration: "2 min" },
]

export function AnalyticsScreen() {
  const [timeRange, setTimeRange] = useState<"week" | "month">("week")

  const totalCries = weeklyData.reduce((acc, day) => acc + day.hungry + day.discomfort, 0)
  const avgPerDay = (totalCries / 7).toFixed(1)

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-border/50 safe-top">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">AI Analytics</h1>
            <p className="text-muted-foreground">Cry detection insights</p>
          </div>
          <Badge variant="secondary" className="h-8">
            <Calendar className="w-4 h-4 mr-1" />
            This Week
          </Badge>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-destructive/20 to-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
                  <Utensils className="w-4 h-4 text-destructive" />
                </div>
                <span className="text-sm text-muted-foreground">Hungry</span>
              </div>
              <p className="text-3xl font-bold text-foreground">23</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="w-4 h-4 text-secondary" />
                <span className="text-sm text-secondary">-12% vs last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-warning/20 to-warning/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center">
                  <Frown className="w-4 h-4 text-warning" />
                </div>
                <span className="text-sm text-muted-foreground">Discomfort</span>
              </div>
              <p className="text-3xl font-bold text-foreground">12</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4 text-destructive" />
                <span className="text-sm text-destructive">+5% vs last week</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Time Range Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2"
        >
          <Button
            variant={timeRange === "week" ? "default" : "outline"}
            onClick={() => setTimeRange("week")}
            className="flex-1 rounded-xl"
          >
            Weekly
          </Button>
          <Button
            variant={timeRange === "month" ? "default" : "outline"}
            onClick={() => setTimeRange("month")}
            className="flex-1 rounded-xl"
          >
            Monthly
          </Button>
        </motion.div>

        {/* Weekly Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Crying Frequency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: "12px", 
                        border: "none", 
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)" 
                      }} 
                    />
                    <Bar dataKey="hungry" fill="#FF9B9B" radius={[4, 4, 0, 0]} name="Hungry" />
                    <Bar dataKey="discomfort" fill="#FFC37A" radius={[4, 4, 0, 0]} name="Discomfort" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-sm text-muted-foreground">Hungry</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span className="text-sm text-muted-foreground">Discomfort</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Cry Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 rounded-xl bg-destructive/10">
                  <p className="text-2xl font-bold text-destructive">65%</p>
                  <p className="text-sm text-muted-foreground">Hungry</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-warning/10">
                  <p className="text-2xl font-bold text-warning">35%</p>
                  <p className="text-sm text-muted-foreground">Discomfort</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Monthly Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7EC8E3" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#7EC8E3" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="week" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: "12px", 
                        border: "none", 
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)" 
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#7EC8E3" 
                      strokeWidth={2}
                      fill="url(#colorTotal)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Today&apos;s Activity</CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityTimeline.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${activity.type === "Hungry" ? "bg-destructive" : "bg-warning"}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground">{activity.type}</p>
                        <span className="text-sm text-muted-foreground">{activity.duration}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <BottomNavigation />
    </div>
  )
}
