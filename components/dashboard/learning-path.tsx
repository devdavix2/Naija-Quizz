"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Lock, BookOpen, Award, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface Topic {
  id: string
  title: string
  description: string
  progress: number
  status: "completed" | "in-progress" | "locked"
  quizCount: number
  completedQuizzes: number
  difficulty: "beginner" | "intermediate" | "advanced"
}

export default function LearningPath() {
  const [topics, setTopics] = useState<Topic[]>([
    {
      id: "nigerian-history",
      title: "Nigerian History",
      description: "Learn about the rich history of Nigeria from pre-colonial times to independence.",
      progress: 100,
      status: "completed",
      quizCount: 5,
      completedQuizzes: 5,
      difficulty: "beginner",
    },
    {
      id: "nigerian-culture",
      title: "Nigerian Culture",
      description: "Explore the diverse cultural heritage of Nigeria including traditions, food, and festivals.",
      progress: 60,
      status: "in-progress",
      quizCount: 5,
      completedQuizzes: 3,
      difficulty: "beginner",
    },
    {
      id: "nigerian-languages",
      title: "Nigerian Languages",
      description: "Discover the major languages of Nigeria and learn basic phrases.",
      progress: 20,
      status: "in-progress",
      quizCount: 5,
      completedQuizzes: 1,
      difficulty: "intermediate",
    },
    {
      id: "nigerian-geography",
      title: "Nigerian Geography",
      description: "Study the geographical features, states, and natural resources of Nigeria.",
      progress: 0,
      status: "locked",
      quizCount: 5,
      completedQuizzes: 0,
      difficulty: "intermediate",
    },
    {
      id: "nigerian-politics",
      title: "Nigerian Politics",
      description: "Understand the political system and governance structure of Nigeria.",
      progress: 0,
      status: "locked",
      quizCount: 5,
      completedQuizzes: 0,
      difficulty: "advanced",
    },
  ])

  const totalProgress = Math.round(topics.reduce((acc, topic) => acc + topic.progress, 0) / topics.length)

  const getStatusIcon = (status: Topic["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "in-progress":
        return <BookOpen className="h-5 w-5 text-blue-600" />
      case "locked":
        return <Lock className="h-5 w-5 text-gray-400" />
    }
  }

  const getDifficultyColor = (difficulty: Topic["difficulty"]) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "intermediate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "advanced":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Your Learning Path</CardTitle>
            <CardDescription>Track your progress through Nigerian knowledge topics</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            <span className="font-medium">{totalProgress}% Complete</span>
          </div>
        </div>
        <Progress value={totalProgress} className="h-2" />
      </CardHeader>

      <CardContent className="space-y-6">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`border rounded-lg p-4 ${topic.status === "locked" ? "opacity-60" : ""}`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(topic.status)}
                <h3 className="font-medium text-lg">{topic.title}</h3>
                <Badge className={getDifficultyColor(topic.difficulty)}>{topic.difficulty}</Badge>
              </div>
              <div className="text-sm text-gray-500">
                {topic.completedQuizzes}/{topic.quizCount} quizzes
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">{topic.description}</p>

            <div className="flex justify-between items-center">
              <Progress value={topic.progress} className="h-2 w-3/4" />

              {topic.status === "locked" ? (
                <Button variant="outline" disabled>
                  Locked <Lock className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Link href={`/learning-path/${topic.id}`}>
                  <Button variant="outline" className="text-green-600 border-green-600">
                    {topic.status === "completed" ? "Review" : "Continue"} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}

