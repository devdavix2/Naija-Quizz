"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Wifi, WifiOff } from "lucide-react"
import { useStore } from "@/lib/store"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showAlert, setShowAlert] = useState(false)
  const offlineMode = useStore((state) => state.offlineMode)

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine)

    // Add event listeners for online/offline events
    const handleOnline = () => {
      setIsOnline(true)
      setShowAlert(true)
      // Hide alert after 3 seconds
      setTimeout(() => setShowAlert(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowAlert(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Show alert when offline mode is toggled
  useEffect(() => {
    setShowAlert(true)
    const timer = setTimeout(() => setShowAlert(false), 3000)
    return () => clearTimeout(timer)
  }, [offlineMode])

  // Don't show anything if online and not in offline mode
  if (isOnline && !offlineMode && !showAlert) return null

  return (
    <AnimatePresence>
      {showAlert && (
        <motion.div
          className="fixed bottom-4 right-4 z-50 max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
        >
          <Alert variant={!isOnline ? "destructive" : offlineMode ? "default" : "success"}>
            {!isOnline ? (
              <WifiOff className="h-4 w-4" />
            ) : offlineMode ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <Wifi className="h-4 w-4" />
            )}
            <AlertTitle>
              {!isOnline ? "You are offline" : offlineMode ? "Offline Mode Enabled" : "You are back online"}
            </AlertTitle>
            <AlertDescription>
              {!isOnline
                ? "Your changes will be saved locally and synced when you're back online."
                : offlineMode
                  ? "All quiz data is stored locally. Some features may be limited."
                  : offlineMode
                    ? "All quiz data is stored locally. Some features may be limited."
                    : "Your data will now sync with the cloud."}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

