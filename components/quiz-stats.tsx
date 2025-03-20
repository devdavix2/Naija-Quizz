import { getQuizStatistics } from "@/lib/quiz-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "@/components/ui/chart"

export async function QuizStats() {
  const stats = await getQuizStatistics()

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Quiz Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.categoryCompletions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completions" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Quizzes Taken</p>
            <p className="text-3xl font-bold">{stats.totalQuizzesTaken}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
            <p className="text-3xl font-bold">{stats.activeUsers}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Most Popular Quiz</p>
            <p className="text-lg font-medium">{stats.mostPopularQuiz}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Completion Rate</p>
            <p className="text-3xl font-bold">{stats.avgCompletionRate}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

