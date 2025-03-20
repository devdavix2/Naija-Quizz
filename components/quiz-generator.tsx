"use client"

// This component now uses the updated gemini-service that calls the free Gemini model (gemini-1.5-flash)

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useStore } from "@/lib/store"
import { generateQuiz, generateFallbackQuiz, getQuizCategories } from "@/lib/gemini-service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function QuizGenerator() {
  const router = useRouter()
  const { toast } = useToast()

  const geminiApiKey = useStore((state) => state.geminiApiKey)
  const addDynamicQuiz = useStore((state) => state.addDynamicQuiz)

  const [selectedCategory, setSelectedCategory] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const categories = getQuizCategories()

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
      // Log and toast indicating we're using the free Gemini model via gemini-service
      console.log("Generating quiz using free Gemini model (gemini-1.5-flash)")
      toast({
        title: "Generating quiz",
        description: "Please wait while we create your quiz...",
      })

      // Generate quiz using the stored API key (via updated gemini-service)
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-green-600" />
          Generate a New Quiz
        </CardTitle>
      </CardHeader>
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
    </Card>
  )
}

