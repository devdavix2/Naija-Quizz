"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Star, TrendingUp, History, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface QuizRecommendation {
  id: string
  title: string
  description: string
  category: string
  matchScore: number
  reason: "history" | "popular" | "trending" | "personalized"
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedTime: number
}

export default function PersonalizedQuizRecommendations() {
  const [recommendations, setRecommendations] = useState<QuizRecommendation[]>([])
  const [filter, setFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading data
  useEffect(() => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const data: QuizRecommendation[] = [
        {
          id: "nigerian-music",
          title: "Nigerian Music Through the Decades",
          description: "Test your knowledge of Nigerian music from highlife to afrobeats.",
          category: "Arts & Culture",
          matchScore: 95,
          reason: "personalized",
          difficulty: "intermediate",
          estimatedTime: 10,
        },
        {
          id: "nigerian-foods",
          title: "Nigerian Cuisine & Delicacies",
          description: "How well do you know Nigerian foods from different regions?",
          category: "Food & Cuisine",
          matchScore: 92,
          reason: "history",
          difficulty: "beginner",
          estimatedTime: 8,
        },
        {
          id: "nigerian-languages",
          title: "Nigerian Languages & Dialects",
          description: "Test your knowledge of Nigeria's diverse languages.",
          category: "Language",
          matchScore: 88,
          reason: "personalized",
          difficulty: "advanced",
          estimatedTime: 15,
        },
        {
          id: "nigerian-festivals",
          title: "Nigerian Cultural Festivals",
          description: "Explore the rich cultural festivals across Nigeria.",
          category: "Arts & Culture",
          matchScore: 85,
          reason: "trending",
          difficulty: "intermediate",
          estimatedTime: 12,
        },
        {
          id: "nigerian-geography",
          title: "Nigerian Geography Challenge",
          description: "Test your knowledge of Nigerian states, cities, and landmarks.",
          category: "Geography",
          matchScore: 82,
          reason: "popular",
          difficulty: "beginner",
          estimatedTime: 10,
        },
        {
          id: "nigerian-history",
          title: "Pre-Colonial Nigerian History",
          description: "How much do you know about Nigeria before colonization?",
          category: "History",
          matchScore: 80,
          reason: "history",
          difficulty: "advanced",
          estimatedTime: 15,
        },
      ]

      setRecommendations(data)
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredRecommendations =
    filter === "all" ? recommendations : recommendations.filter((rec) => rec.reason === filter)

  const getReasonIcon = (reason: QuizRecommendation["reason"]) => {
    switch (reason) {
      case "history":
        return <History className="h-4 w-4" />
      case "popular":
        return <Star className="h-4 w-4" />
      case "trending":
        return <TrendingUp className="h-4 w-4" />
      case "personalized":
        return <Sparkles className="h-4 w-4" />
    }
  }

  const getReasonText = (reason: QuizRecommendation["reason"]) => {
    switch (reason) {
      case "history":
        return "Based on your history"
      case "popular":
        return "Popular with users like you"
      case "trending":
        return "Trending now"
      case "personalized":
        return "Tailored for you"
    }
  }

  const getDifficultyColor = (difficulty: QuizRecommendation["difficulty"]) => {
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Recommended for You</CardTitle>
            <CardDescription>Quizzes tailored to your interests and performance</CardDescription>
          </div>
          <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="personalized">For You</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRecommendations.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-4 hover:border-green-500 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg">{quiz.title}</h3>
                  <Badge className="bg-green-600">{quiz.matchScore}% Match</Badge>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{quiz.description}</p>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline">{quiz.category}</Badge>
                  <Badge className={getDifficultyColor(quiz.difficulty)}>{quiz.difficulty}</Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {quiz.estimatedTime} min
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    {getReasonIcon(quiz.reason)}
                    <span>{getReasonText(quiz.reason)}</span>
                  </div>

                  <Link href={`/quiz/${quiz.id}`}>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Take Quiz
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

