"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useApp } from "@/components/app-context"
import { 
  Mail, 
  ArrowLeft,
  CheckCircle
} from "lucide-react"

export function ForgotPasswordScreen() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { setScreen } = useApp()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSuccess(true)
    setIsLoading(false)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-background safe-top safe-bottom">
        <div className="p-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setScreen("login")}
            className="w-12 h-12 rounded-full"
            aria-label="Go back to login"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6"
          >
            <CheckCircle className="w-12 h-12 text-secondary-foreground" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-foreground mb-4">Check Your Email</h2>
          <p className="text-lg text-muted-foreground text-center mb-8 max-w-sm">
            {"We've sent password reset instructions to "}<strong>{email}</strong>
          </p>
          
          <Button
            size="lg"
            onClick={() => setScreen("login")}
            className="h-16 px-12 text-xl rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Back to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background safe-top safe-bottom">
      {/* Header */}
      <div className="p-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setScreen("login")}
          className="w-12 h-12 rounded-full"
          aria-label="Go back to login"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 px-6"
      >
        <h1 className="text-3xl font-bold text-foreground mb-4">Forgot Password?</h1>
        <p className="text-lg text-muted-foreground mb-8">
          {"Enter your email address and we'll send you instructions to reset your password."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-lg font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-16 pl-14 text-lg rounded-2xl bg-muted border-0"
                required
                aria-required="true"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="w-full h-16 text-xl rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </motion.div>

      {/* Back to login */}
      <div className="p-6 text-center">
        <Button
          variant="link"
          onClick={() => setScreen("login")}
          className="text-primary text-lg"
        >
          Back to Sign In
        </Button>
      </div>
    </div>
  )
}
