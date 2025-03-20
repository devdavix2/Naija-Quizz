"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

interface PerformanceData {
  date: string
  score: number
  average: number
  quizId: string
  quizTitle: string
  category: string
}

interface CategoryData {
  name: string
  value: number
  color: string
}

export default function QuizPerformanceChart() {
  const [timeRange, setTimeRange] = useState("month")
  const [chartType, setChartType] = useState("line")

  // Sample data - in a real app, this would come from an API
  const performanceData: PerformanceData[] = [
    { date: "Jan 1", score: 80, average: 70, quizId: "1", quizTitle: "Nigerian History", category: "History" },
    { date: "Jan 5", score: 65, average: 68, quizId: "2", quizTitle: "Nigerian Food", category: "Culture" },
    { date: "Jan 10", score: 90, average: 72, quizId: "3", quizTitle: "Nigerian Music", category: "Arts" },
    { date: "Jan 15", score: 75, average: 73, quizId: "4", quizTitle: "Nigerian Languages", category: "Language" },
    { date: "Jan 20", score: 85, average: 75, quizId: "5", quizTitle: "Nigerian Geography", category: "Geography" },
    { date: "Jan 25", score: 95, average: 78, quizId: "6", quizTitle: "Nigerian Literature", category: "Arts" },
    { date: "Jan 30", score: 88, average: 80, quizId: "7", quizTitle: "Nigerian Politics", category: "Politics" },
  ]

  const categoryData: CategoryData[] = [
    { name: "History", value: 35, color: COLORS[0] },
    { name: "Culture", value: 25, color: COLORS[1] },
    { name: "Arts", value: 15, color: COLORS[2] },
    { name: "Language", value: 10, color: COLORS[3] },
    { name: "Geography", value: 10, color: COLORS[4] },
    { name: "Politics", value: 5, color: COLORS[5] },
  ]

  const renderLineChart = (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 100]} />
        <Tooltip
          formatter={(value: number) => [`${value}%`, "Score"]}
          labelFormatter={(label) => {
            const quiz = performanceData.find((item) => item.date === label)
            return quiz ? `${quiz.quizTitle} (${label})` : label
          }}
        />
        <Legend />
        <Line type="monotone" dataKey="score" stroke="#22c55e" activeDot={{ r: 8 }} strokeWidth={2} name="Your Score" />
        <Line type="monotone" dataKey="average" stroke="#9ca3af" strokeDasharray="5 5" name="Community Average" />
      </LineChart>
    </ResponsiveContainer>
  )

  const renderBarChart = (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 100]} />
        <Tooltip
          formatter={(value: number) => [`${value}%`, "Score"]}
          labelFormatter={(label) => {
            const quiz = performanceData.find((item) => item.date === label)
            return quiz ? `${quiz.quizTitle} (${label})` : label
          }}
        />
        <Legend />
        <Bar dataKey="score" fill="#22c55e" name="Your Score" />
        <Bar dataKey="average" fill="#9ca3af" name="Community Average" />
      </BarChart>
    </ResponsiveContainer>
  )

  const renderPieChart = (
    <ResponsiveContainer width="100%" height={300}>
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
        <Tooltip formatter={(value: number) => [`${value}%`, "Completion"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Quiz Performance</CardTitle>
            <CardDescription>Track your quiz scores over time</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="line" value={chartType} onValueChange={setChartType} className="mb-4">
          <TabsList className="grid grid-cols-3 w-[300px]">
            <TabsTrigger value="line">Line</TabsTrigger>
            <TabsTrigger value="bar">Bar</TabsTrigger>
            <TabsTrigger value="pie">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="line" className="pt-4">
            {renderLineChart}
          </TabsContent>

          <TabsContent value="bar" className="pt-4">
            {renderBarChart}
          </TabsContent>

          <TabsContent value="pie" className="pt-4">
            {renderPieChart}
          </TabsContent>
        </Tabs>

        <div className="text-sm text-gray-500 text-center mt-4">
          {chartType === "pie"
            ? "Distribution of quiz categories you have completed"
            : "Your quiz performance compared to community average"}
        </div>
      </CardContent>
    </Card>
  )
}

