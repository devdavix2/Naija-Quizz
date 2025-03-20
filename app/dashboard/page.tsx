"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArrowLeft, Award, BookOpen, Star, Download, Upload } from "lucide-react"
import QuizInsights from "@/components/dashboard/quiz-insights"
import { useStore } from "@/lib/store"
import { useOfflineMode } from "@/lib/offline-manager"
import { getStorageStats } from "@/lib/enhanced-storage"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [storageStats, setStorageStats] = useState({
    usage: 0,
    quota: 0,
    percentUsed: 0,
    itemCount: 0,
    enhancedItemCount: 0,
  })

  const quizResults = useStore((state) => state.quizResults)
  const favorites = useStore((state) => state.getFavorites())
  const dynamicQuizzes = useStore((state) => state.getDynamicQuizzes())
  const { offlineMode, enableOfflineMode, disableOfflineMode, isOnline } = useOfflineMode()

  // Calculate user level and progress
  const totalQuizzes = quizResults.length
  const userLevel = Math.floor(totalQuizzes / 5) + 1
  const progress = ((totalQuizzes % 5) / 5) * 100

  // Get storage stats
  const updateStorageStats = async () => {
    const stats = await getStorageStats()
    setStorageStats(stats)
  }

  // Export user data
  const exportUserData = () => {
    try {
      const userData = {
        quizResults: useStore.getState().quizResults,
        favorites: useStore.getState().favorites,
        dynamicQuizzes: useStore.getState().dynamicQuizzes,
        notes: useStore.getState().notes,
        preferences: {
          theme: useStore.getState().theme,
          preferredLanguage: useStore.getState().preferredLanguage,
        },
      }

      const dataStr = JSON.stringify(userData, null, 2)
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

      const exportFileDefaultName = `naijaspark-data-${new Date().toISOString().slice(0, 10)}.json`

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()

      toast({
        title: "Data exported successfully",
        description: "Your quiz data has been downloaded",
      })
    } catch (error) {
      console.error("Error exporting data:", error)

      toast({
        title: "Export failed",
        description: "Could not export your data",
        variant: "destructive",
      })
    }
  }

  // Import user data
  const importUserData = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "application/json"

    input.onchange = (e: any) => {
      const file = e.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string)

          // Validate data structure
          if (!data.quizResults || !data.favorites || !data.dynamicQuizzes) {
            throw new Error("Invalid data format")
          }

          // Import data into store
          const store = useStore.getState()

          // Import quiz results
          data.quizResults.forEach((result: any) => {
            store.saveQuizResult(result)
          })

          // Import dynamic quizzes
          data.dynamicQuizzes.forEach((quiz: any) => {
            store.addDynamicQuiz(quiz)
          })

          // Import favorites
          data.favorites.forEach((fav: any) => {
            if (!store.isFavorite(fav.quizId)) {
              store.toggleFavorite(fav.quizId)
            }
          })

          // Import notes if available
          if (data.notes) {
            data.notes.forEach((note: any) => {
              store.addNote(note.quizId, note.note)
            })
          }

          // Import preferences if available
          if (data.preferences) {
            if (data.preferences.theme) {
              store.setTheme(data.preferences.theme)
            }

            if (data.preferences.preferredLanguage) {
              store.setPreferredLanguage(data.preferences.preferredLanguage)
            }
          }

          toast({
            title: "Data imported successfully",
            description: "Your quiz data has been restored",
          })
        } catch (error) {
          console.error("Error importing data:", error)

          toast({
            title: "Import failed",
            description: "Invalid data format",
            variant: "destructive",
          })
        }
      }

      reader.readAsText(file)
    }

    input.click()
  }

  // Update storage stats when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value)

    if (value === "storage") {
      updateStorageStats()
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center">
        <Button variant="outline" onClick={() => router.push("/")} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold">Your Dashboard</h1>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="col-span-1"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <span className="text-3xl font-bold">{userLevel}</span>
                      </div>
                      <div className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full p-1">
                        <Award className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-500 mb-1">Level {userLevel} Quiz Master</p>
                    <p className="text-xs text-gray-400">
                      {5 - (totalQuizzes % 5)} more quizzes to level {userLevel + 1}
                    </p>
                  </div>

                  <Progress value={progress} className="h-2 mb-2" />

                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Level {userLevel}</span>
                    <span>Level {userLevel + 1}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                      <p className="text-3xl font-bold">{totalQuizzes}</p>
                      <p className="text-sm text-gray-500">Quizzes Taken</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                      <p className="text-3xl font-bold">{favorites.length}</p>
                      <p className="text-sm text-gray-500">Favorites</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                      <p className="text-3xl font-bold">{dynamicQuizzes.length}</p>
                      <p className="text-sm text-gray-500">Generated Quizzes</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                      <p className="text-3xl font-bold">{quizResults.reduce((acc, result) => acc + result.score, 0)}</p>
                      <p className="text-sm text-gray-500">Total Points</p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <Button
                      onClick={() => router.push("/quiz/nigerian-culture")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Take a Quiz
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <QuizInsights />
          </motion.div>
        </TabsContent>

        <TabsContent value="insights">
          <QuizInsights />
        </TabsContent>

        <TabsContent value="storage">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Storage Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-500">
                      {(storageStats.usage / (1024 * 1024)).toFixed(2)} MB used
                    </span>
                    <span className="text-sm text-gray-500">
                      {(storageStats.quota / (1024 * 1024)).toFixed(2)} MB total
                    </span>
                  </div>
                  <Progress value={storageStats.percentUsed} className="h-2" />
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Items in storage</span>
                      <span className="text-sm">{storageStats.itemCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Enhanced items</span>
                      <span className="text-sm text-gray-500">{storageStats.enhancedItemCount}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Offline mode</span>
                      <Badge variant={offlineMode ? "default" : "outline"}>
                        {offlineMode ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Network status</span>
                      <Badge variant={isOnline ? "default" : "destructive"} className={isOnline ? "bg-green-600" : ""}>
                        {isOnline ? "Online" : "Offline"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={updateStorageStats}>
                    Refresh Stats
                  </Button>

                  <Button
                    onClick={offlineMode ? disableOfflineMode : enableOfflineMode}
                    variant={offlineMode ? "outline" : "default"}
                    className={!offlineMode ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {offlineMode ? "Disable Offline Mode" : "Enable Offline Mode"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Download className="h-5 w-5 text-green-600" />
                      <h3 className="font-medium">Export Your Data</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      Download all your quiz results, favorites, and custom quizzes as a JSON file.
                    </p>
                    <Button onClick={exportUserData} className="w-full">
                      Export Data
                    </Button>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Upload className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium">Import Data</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      Restore your quiz data from a previously exported file.
                    </p>
                    <Button onClick={importUserData} variant="outline" className="w-full">
                      Import Data
                    </Button>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <h3 className="font-medium">Saved Content</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Favorite Quizzes</span>
                        <span>{favorites.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Generated Quizzes</span>
                        <span>{dynamicQuizzes.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quiz Results</span>
                        <span>{quizResults.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>User Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Theme</h3>
                  <div className="flex gap-3">
                    {["light", "dark", "system"].map((theme) => (
                      <Button
                        key={theme}
                        variant={useStore.getState().theme === theme ? "default" : "outline"}
                        className={useStore.getState().theme === theme ? "bg-green-600 hover:bg-green-700" : ""}
                        onClick={() => useStore.getState().setTheme(theme as any)}
                      >
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Language Preference</h3>
                  <div className="flex gap-3">
                    {["english", "pidgin", "yoruba", "igbo", "hausa"].map((lang) => (
                      <Button
                        key={lang}
                        variant={useStore.getState().preferredLanguage === lang ? "default" : "outline"}
                        className={
                          useStore.getState().preferredLanguage === lang ? "bg-green-600 hover:bg-green-700" : ""
                        }
                        onClick={() => useStore.getState().setPreferredLanguage(lang)}
                      >
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Offline Mode</h3>
                  <div className="flex gap-3">
                    <Button
                      variant={offlineMode ? "default" : "outline"}
                      className={offlineMode ? "bg-green-600 hover:bg-green-700" : ""}
                      onClick={offlineMode ? disableOfflineMode : enableOfflineMode}
                    >
                      {offlineMode ? "Disable Offline Mode" : "Enable Offline Mode"}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {offlineMode
                      ? "Offline mode is enabled. You can use the app without an internet connection."
                      : "Enable offline mode to use the app without an internet connection."}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Data Management</h3>
                  <div className="flex gap-3">
                    <Button onClick={exportUserData}>Export Data</Button>
                    <Button onClick={importUserData} variant="outline">
                      Import Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

