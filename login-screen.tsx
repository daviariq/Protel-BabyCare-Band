"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useApp } from "@/components/app-context"
import { 
  Baby, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Fingerprint,
  ArrowLeft
} from "lucide-react"

export function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { setScreen, setIsAuthenticated } = useApp()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    localStorage.setItem("babycare-auth", "true")
    setIsAuthenticated(true)
    setScreen("home")
    setIsLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    localStorage.setItem("babycare-auth", "true")
    setIsAuthenticated(true)
    setScreen("home")
    setIsLoading(false)
  }

  const handleBiometric = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    localStorage.setItem("babycare-auth", "true")
    setIsAuthenticated(true)
    setScreen("home")
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background safe-top safe-bottom">
      {/* Header */}
      <div className="p-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setScreen("onboarding")}
          className="w-12 h-12 rounded-full"
          aria-label="Go back to onboarding"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mb-8"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
          <Baby className="w-10 h-10 text-primary-foreground" strokeWidth={1.5} />
        </div>
        <h1 className="mt-4 text-3xl font-bold text-foreground">Welcome Back</h1>
        <p className="mt-2 text-lg text-muted-foreground">Sign in to continue</p>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleLogin}
        className="flex-1 px-6 space-y-6"
      >
        {/* Email */}
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

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-lg font-medium">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-16 pl-14 pr-14 text-lg rounded-2xl bg-muted border-0"
              required
              aria-required="true"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Forgot password */}
        <Button
          type="button"
          variant="link"
          onClick={() => setScreen("forgot-password")}
          className="text-primary text-lg p-0 h-auto"
        >
          Forgot Password?
        </Button>

        {/* Login button */}
        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          className="w-full h-16 text-xl rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground text-lg">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Google Sign In */}
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full h-16 text-lg rounded-2xl"
        >
          <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>

        {/* Biometric */}
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={handleBiometric}
          disabled={isLoading}
          className="w-full h-16 text-lg rounded-2xl"
        >
          <Fingerprint className="w-6 h-6 mr-3" />
          Use Biometric
        </Button>
      </motion.form>

      {/* Sign up link */}
      <div className="p-6 text-center">
        <p className="text-lg text-muted-foreground">
          {"Don't have an account? "}
          <Button
            variant="link"
            onClick={() => setScreen("register")}
            className="text-primary text-lg p-0 h-auto font-semibold"
          >
            Sign Up
          </Button>
        </p>
      </div>
    </div>
  )
}
