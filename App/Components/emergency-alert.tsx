"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useApp } from "@/components/app-context"
import { AlertTriangle, X } from "lucide-react"

export function EmergencyAlert() {
  const { showEmergencyAlert, setShowEmergencyAlert } = useApp()

  return (
    <AnimatePresence>
      {showEmergencyAlert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="emergency-title"
          aria-describedby="emergency-description"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
            }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative w-full max-w-sm"
          >
            {/* Pulsing background */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 rounded-3xl bg-gradient-to-br from-destructive/50 to-warning/50 blur-xl"
            />
            
            {/* Card */}
            <div className="relative bg-gradient-to-br from-destructive/90 to-warning/80 rounded-3xl p-8 shadow-2xl">
              {/* Close button */}
              <button
                onClick={() => setShowEmergencyAlert(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
                aria-label="Close alert"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Icon */}
              <motion.div
                animate={{
                  rotate: [-5, 5, -5],
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-24 h-24 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-6"
              >
                <AlertTriangle className="w-12 h-12 text-white" strokeWidth={2.5} />
              </motion.div>

              {/* Title */}
              <h2
                id="emergency-title"
                className="text-3xl font-bold text-white text-center mb-4"
              >
                Bayi Anda sedang membutuhkan anda!
              </h2>

              {/* Description */}
              <p
                id="emergency-description"
                className="text-lg text-white/90 text-center mb-8"
              >
                Your baby needs your attention right now.
              </p>

              {/* Button */}
              <Button
                onClick={() => setShowEmergencyAlert(false)}
                size="lg"
                className="w-full h-16 text-xl font-bold rounded-2xl bg-white text-destructive hover:bg-white/90"
              >
                Oke
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
