"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BarChart3, Award, Clock } from "lucide-react"
import { useStore } from "@/lib/store"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "@/components/ui/chart"
import { motion } from "framer-motion"

export default function StatisticsPage() {
  const router = useRouter()
  const getStatistics = useStore((state) => state.getStatistics)
  const clearQuizHistory = useStore((state) => state.clearQuizHistory)

  const stats = getStatistics()

  // Format data for charts
  const categoryData = Object.entries(stats.quizzesByCategory || {}).map(([name, count]) => ({
    name,
    count,
  }))

  // Define colors for the pie chart
  const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

  // Handle clear history
  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear your quiz history? This action cannot be undone.")) {
      clearQuizHistory()
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center">
          <Button variant="outline" onClick={() => router.push("/")} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-3xl font-bold flex items-center">
            <BarChart3 className="mr-2 h-6 w-6 text-green-600" /> Your Quiz Statistics
          </h1>
        </div>

        {stats.totalQuizzesTaken > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">Total Quizzes Taken</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Award className="h-8 w-8 text-green-600 mr-2" />
                      <span className="text-3xl font-bold">{stats.totalQuizzesTaken}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">Average Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <BarChart3 className="h-8 w-8 text-green-600 mr-2" />
                      <span className="text-3xl font-bold">{stats.averageScore}%</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">Best Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Award className="h-8 w-8 text-green-600 mr-2" />
                      <span className="text-xl font-bold truncate">{stats.bestCategory || "N/A"}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">Needs Improvement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Clock className="h-8 w-8 text-green-600 mr-2" />
                      <span className="text-xl font-bold truncate">{stats.worstCategory || "N/A"}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <Tabs defaultValue="categories" className="mb-8">
              <TabsList>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="categories">
                <Card>
                  <CardHeader>
                    <CardTitle>Quizzes by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#22c55e" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance">
                <Card>
                  <CardHeader>
                    <CardTitle>Category Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Recent Quiz Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentResults.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-medium">{result.quizTitle}</h3>
                        <span className="text-sm text-gray-500">{new Date(result.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">
                          Score: {result.score}/{result.totalQuestions}
                        </span>
                        <span className="text-sm font-medium">
                          {Math.round((result.score / result.totalQuestions) * 100)}%
                        </span>
                      </div>
                      <Progress value={Math.round((result.score / result.totalQuestions) * 100)} className="h-2" />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button variant="outline" onClick={handleClearHistory} className="text-red-500">
                Clear Quiz History
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No quiz data yet</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Take some quizzes to see your statistics and track your progress.
            </p>
            <Button onClick={() => router.push("/")} className="bg-green-600 hover:bg-green-700">
              Start a Quiz
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

