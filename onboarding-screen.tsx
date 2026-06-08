"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useApp } from "@/components/app-context"
import { 
  Baby, 
  Watch, 
  Mic, 
  Video, 
  Accessibility,
  ChevronRight,
  ChevronLeft
} from "lucide-react"

const slides = [
  {
    icon: Baby,
    title: "Smart Baby Monitoring",
    description: "Monitor your baby&apos;s well-being in real-time with our intelligent IoT system designed for peace of mind.",
    color: "from-primary to-primary/60",
  },
  {
    icon: Watch,
    title: "Smartband Alerts",
    description: "Receive instant vibration alerts on your smartband when your baby needs attention - no sound required.",
    color: "from-secondary to-secondary/60",
  },
  {
    icon: Mic,
    title: "AI Cry Detection",
    description: "Our AI accurately detects and categorizes your baby&apos;s cries - whether hungry or uncomfortable.",
    color: "from-accent to-accent/60",
  },
  {
    icon: Video,
    title: "Event-Based Monitoring",
    description: "Smart camera activation captures important moments without constant streaming, saving battery and data.",
    color: "from-primary to-secondary",
  },
  {
    icon: Accessibility,
    title: "Accessibility First",
    description: "Designed with large touch targets, high contrast, and screen reader support for all parents.",
    color: "from-secondary to-accent",
  },
]

export function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { setScreen } = useApp()

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const handleGetStarted = () => {
    localStorage.setItem("babycare-onboarding", "true")
    setScreen("login")
  }

  const slide = slides[currentSlide]
  const Icon = slide.icon

  return (
    <div className="min-h-screen flex flex-col bg-background safe-top safe-bottom">
      {/* Skip button */}
      <div className="flex justify-end p-6">
        <Button
          variant="ghost"
          onClick={handleGetStarted}
          className="text-muted-foreground text-lg"
          aria-label="Skip onboarding and go to login"
        >
          Skip
        </Button>
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            {/* Icon */}
            <div className={`w-40 h-40 rounded-full bg-gradient-to-br ${slide.color} flex items-center justify-center mb-10 shadow-xl`}>
              <Icon className="w-20 h-20 text-primary-foreground" strokeWidth={1.5} />
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-foreground mb-4 text-balance">
              {slide.title}
            </h2>

            {/* Description */}
            <p className="text-xl text-muted-foreground leading-relaxed max-w-sm text-pretty">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-3 mb-8" role="tablist" aria-label="Onboarding slides">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-primary w-8"
                : "bg-muted-foreground/30"
            }`}
            role="tab"
            aria-selected={index === currentSlide}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-4 px-6 pb-8">
        {currentSlide > 0 && (
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrev}
            className="flex-1 h-16 text-lg rounded-2xl"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 mr-2" />
            Back
          </Button>
        )}
        
        {currentSlide < slides.length - 1 ? (
          <Button
            size="lg"
            onClick={handleNext}
            className="flex-1 h-16 text-lg rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground"
            aria-label="Next slide"
          >
            Next
            <ChevronRight className="w-6 h-6 ml-2" />
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="flex-1 h-16 text-lg rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground"
            aria-label="Get started with BabyCare"
          >
            Get Started
            <ChevronRight className="w-6 h-6 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}
