"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles, ArrowRight, Lightbulb, BookOpen, Brain } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useStore } from "@/lib/store"
import { generateQuiz, generateFallbackQuiz, getQuizCategories } from "@/lib/gemini-service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

export function QuizGeneratorEnhanced() {
  const router = useRouter()
  const { toast } = useToast()

  const geminiApiKey = useStore((state) => state.geminiApiKey)
  const addDynamicQuiz = useStore((state) => state.addDynamicQuiz)
  const getDynamicQuizzes = useStore((state) => state.getDynamicQuizzes)

  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium")
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("generate")

  const categories = getQuizCategories()
  const recentQuizzes = getDynamicQuizzes().slice(0, 3)

  const handleGenerateQuiz = async () => {
    if (!selectedCategory) {
      toast({
        title: "Please select a category",
        description: "Choose a quiz category to generate questions.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      toast({
        title: "Generating quiz",
        description: "Please wait while we create your quiz...",
      })

      // Generate quiz using the stored API key
      const quiz = await generateQuiz(selectedCategory, geminiApiKey)

      if (quiz) {
        // Save quiz to store
        addDynamicQuiz(quiz)

        toast({
          title: "Quiz generated successfully!",
          description: "Your quiz is ready to take.",
        })

        // Navigate to quiz
        router.push(`/quiz/${quiz.id}`)
      } else {
        // Use fallback if API fails
        toast({
          title: "Using fallback quiz",
          description: "We couldn't generate a custom quiz. Using a pre-made quiz instead.",
        })

        const fallbackQuiz = generateFallbackQuiz(selectedCategory)
        addDynamicQuiz(fallbackQuiz)
        router.push(`/quiz/${fallbackQuiz.id}`)
      }
    } catch (error) {
      console.error("Error generating quiz:", error)

      // Create fallback quiz
      const fallbackQuiz = generateFallbackQuiz(selectedCategory)
      addDynamicQuiz(fallbackQuiz)

      toast({
        title: "Error generating custom quiz",
        description: "We've created a standard quiz for you instead.",
        variant: "destructive",
      })

      router.push(`/quiz/${fallbackQuiz.id}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "hard":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-green-600" />
          AI Quiz Generator
        </CardTitle>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Select Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Choose a quiz category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Select Difficulty</Label>
              <div className="flex gap-2">
                {["easy", "medium", "hard"].map((difficulty) => (
                  <Button
                    key={difficulty}
                    type="button"
                    variant={selectedDifficulty === difficulty ? "default" : "outline"}
                    className={selectedDifficulty === difficulty ? getDifficultyColor(difficulty) : ""}
                    onClick={() => setSelectedDifficulty(difficulty)}
                  >
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md mt-2">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                <span className="font-medium text-sm">Quiz Info</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                This will generate a unique quiz about {selectedCategory || "your selected topic"} with{" "}
                {selectedDifficulty === "easy"
                  ? "basic"
                  : selectedDifficulty === "medium"
                    ? "intermediate"
                    : "challenging"}{" "}
                questions.
              </p>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              onClick={handleGenerateQuiz}
              disabled={isGenerating || !selectedCategory}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Quiz...
                </>
              ) : (
                <>
                  Generate Quiz <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </TabsContent>

        <TabsContent value="recent">
          <CardContent>
            {recentQuizzes.length > 0 ? (
              <div className="space-y-3">
                {recentQuizzes.map((quiz, index) => (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-3 hover:border-green-500 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium">{quiz.title}</h3>
                      <Badge variant="outline">{quiz.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-1">{quiz.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>{quiz.questions.length} questions</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => router.push(`/quiz/${quiz.id}`)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Take Quiz
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Brain className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <h3 className="font-medium mb-1">No quizzes generated yet</h3>
                <p className="text-sm text-gray-500 mb-4">Generate your first AI quiz to see it here</p>
                <Button onClick={() => setActiveTab("generate")} variant="outline">
                  Create a Quiz
                </Button>
              </div>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

