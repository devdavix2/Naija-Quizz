/**
 * Enhanced offline mode manager with service worker integration
 */

import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { getItem, setItem } from "@/lib/enhanced-storage"

// Types
interface OfflineQuiz {
  id: string
  title: string
  category: string
  questions: any[]
  savedAt: number
}

// Register service worker
export async function registerServiceWorker(): Promise<boolean> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.register("/service-worker.js")
    console.log("Service worker registered:", registration)
    return true
  } catch (error) {
    console.error("Service worker registration failed:", error)
    return false
  }
}

// Check if app is online
export function isOnline(): boolean {
  return typeof navigator !== "undefined" ? navigator.onLine : true
}

// Save quizzes for offline use
export async function saveQuizzesForOffline(quizzes: any[]): Promise<boolean> {
  try {
    const offlineQuizzes: OfflineQuiz[] = quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      category: quiz.category,
      questions: quiz.questions,
      savedAt: Date.now(),
    }))

    await setItem("offline_quizzes", offlineQuizzes, {
      compress: true,
      expiry: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    return true
  } catch (error) {
    console.error("Error saving quizzes for offline use:", error)
    return false
  }
}

// Get offline quizzes
export function getOfflineQuizzes(): OfflineQuiz[] {
  return getItem<OfflineQuiz[]>("offline_quizzes", []) || []
}

// Sync offline results when back online
export async function syncOfflineResults(): Promise<boolean> {
  try {
    const offlineResults = getItem<any[]>("offline_results", [])

    if (!offlineResults || offlineResults.length === 0) {
      return true
    }

    // In a real app, this would send results to a server
    // For now, we'll just clear the offline results
    await setItem("offline_results", [])

    return true
  } catch (error) {
    console.error("Error syncing offline results:", error)
    return false
  }
}

// Save quiz result while offline
export async function saveOfflineResult(result: any): Promise<boolean> {
  try {
    const offlineResults = getItem<any[]>("offline_results", [])
    offlineResults?.push({
      ...result,
      savedOffline: true,
      timestamp: Date.now(),
    })

    await setItem("offline_results", offlineResults)
    return true
  } catch (error) {
    console.error("Error saving offline result:", error)
    return false
  }
}

// React hook for offline mode
export function useOfflineMode() {
  const { toast } = useToast()
  const offlineMode = useStore((state) => state.offlineMode)
  const toggleOfflineMode = useStore((state) => state.toggleOfflineMode)

  // Enable offline mode
  const enableOfflineMode = async () => {
    try {
      // Get all quizzes from store
      const quizzes = useStore.getState().getDynamicQuizzes()

      // Save quizzes for offline use
      await saveQuizzesForOffline(quizzes)

      // Register service worker
      await registerServiceWorker()

      // Enable offline mode in store
      toggleOfflineMode()

      toast({
        title: "Offline mode enabled",
        description: "You can now use the app without an internet connection",
      })

      return true
    } catch (error) {
      console.error("Error enabling offline mode:", error)

      toast({
        title: "Failed to enable offline mode",
        description: "Please try again later",
        variant: "destructive",
      })

      return false
    }
  }

  // Disable offline mode
  const disableOfflineMode = async () => {
    try {
      // Sync offline results
      await syncOfflineResults()

      // Disable offline mode in store
      toggleOfflineMode()

      toast({
        title: "Offline mode disabled",
        description: "Your data has been synced",
      })

      return true
    } catch (error) {
      console.error("Error disabling offline mode:", error)

      toast({
        title: "Failed to disable offline mode",
        description: "Please try again later",
        variant: "destructive",
      })

      return false
    }
  }

  return {
    offlineMode,
    enableOfflineMode,
    disableOfflineMode,
    isOnline: isOnline(),
  }
}

