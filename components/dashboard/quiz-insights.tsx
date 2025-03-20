"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { useStore } from "@/lib/store"
import { Award, Brain, Target, Clock } from "lucide-react"
import { motion } from "framer-motion"

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

export default function QuizInsights() {
  const [activeTab, setActiveTab] = useState("performance")
  const quizResults = useStore((state) => state.quizResults)
  const [performanceData, setPerformanceData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [statsData, setStatsData] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    bestCategory: "",
    totalTime: 0,
  })

  useEffect(() => {
    if (quizResults.length === 0) return

    // Process quiz results for charts
    processQuizData()
  }, [quizResults])

  const processQuizData = () => {
    // Performance over time
    const performanceByDate: Record<string, { count: number; totalScore: number }> = {}

    // Categories
    const categoryCounts: Record<string, number> = {}
    const categoryScores: Record<string, { total: number; count: number }> = {}

    let totalTime = 0

    quizResults.forEach((result) => {
      // Format date (just use the date part)
      const date = new Date(result.date).toLocaleDateString()

      // Add to performance by date
      if (!performanceByDate[date]) {
        performanceByDate[date] = { count: 0, totalScore: 0 }
      }
      performanceByDate[date].count += 1
      performanceByDate[date].totalScore += (result.score / result.totalQuestions) * 100

      // Add to category counts
      const category = result.quizTitle.split(" ")[0] // Simple extraction of category
      if (!categoryCounts[category]) {
        categoryCounts[category] = 0
      }
      categoryCounts[category] += 1

      // Track category scores
      if (!categoryScores[category]) {
        categoryScores[category] = { total: 0, count: 0 }
      }
      categoryScores[category].total += (result.score / result.totalQuestions) * 100
      categoryScores[category].count += 1

      // Estimate time (assuming 30 seconds per question)
      totalTime += result.totalQuestions * 30
    })

    // Convert performance data to array
    const performanceArray = Object.entries(performanceByDate)
      .map(([date, data]) => ({
        date,
        score: Math.round(data.totalScore / data.count),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Convert category data to array
    const categoryArray = Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))

    // Find best category
    let bestCategory = ""
    let bestScore = 0

    Object.entries(categoryScores).forEach(([category, data]) => {
      const avgScore = data.total / data.count
      if (avgScore > bestScore) {
        bestScore = avgScore
        bestCategory = category
      }
    })

    // Set state
    setPerformanceData(performanceArray)
    setCategoryData(categoryArray)
    setStatsData({
      totalQuizzes: quizResults.length,
      averageScore: Math.round(
        quizResults.reduce((acc, result) => acc + (result.score / result.totalQuestions) * 100, 0) / quizResults.length,
      ),
      bestCategory,
      totalTime,
    })
  }

  // Format time in hours and minutes
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  if (quizResults.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Insights</CardTitle>
          <CardDescription>Take some quizzes to see your performance insights</CardDescription>
        </CardHeader>
        <CardContent className="h-60 flex items-center justify-center">
          <div className="text-center">
            <Brain className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">No quiz data available yet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Insights</CardTitle>
        <CardDescription>Visualize your quiz performance and statistics</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-500">Quizzes Taken</span>
            </div>
            <p className="text-2xl font-bold">{statsData.totalQuizzes}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-500">Avg. Score</span>
            </div>
            <p className="text-2xl font-bold">{statsData.averageScore}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-1">
              <Brain className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-500">Best Category</span>
            </div>
            <p className="text-xl font-bold truncate">{statsData.bestCategory || "N/A"}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-500">Time Learning</span>
            </div>
            <p className="text-2xl font-bold">{formatTime(statsData.totalTime)}</p>
          </motion.div>
        </div>

        <Tabs defaultValue="performance" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="performance">
            <div className="h-80">
              {performanceData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, "Score"]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#22c55e"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                      name="Average Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">Need more quiz data to show performance trend</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <div className="h-80">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, "Quizzes Taken"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">Take quizzes in different categories to see data</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

