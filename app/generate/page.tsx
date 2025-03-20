"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2, Sparkles, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useStore } from "@/lib/store"
import { generateQuiz, generateFallbackQuiz } from "@/lib/gemini-service"

export default function GeneratePage() {
  const router = useRouter()
  const { toast } = useToast()

  const geminiApiKey = useStore((state) => state.geminiApiKey)
  const addDynamicQuiz = useStore((state) => state.addDynamicQuiz)

  const [customCategory, setCustomCategory] = useState("")
  const [customPrompt, setCustomPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateQuiz = async () => {
    if (!customCategory) {
      toast({
        title: "Category required",
        description: "Please enter a category for your quiz.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // Show toast to indicate generation has started
      toast({
        title: "Generating custom quiz",
        description: "Please wait while we create your quiz...",
      })

      // Generate quiz using the stored API key
      const quiz = await generateQuiz(customCategory, geminiApiKey)

      if (quiz) {
        // Save quiz to store
        addDynamicQuiz(quiz)

        toast({
          title: "Quiz generated successfully!",
          description: "Your custom quiz is ready to take.",
        })

        // Navigate to quiz
        router.push(`/quiz/${quiz.id}`)
      } else {
        // Use fallback if API fails
        toast({
          title: "Using fallback quiz",
          description: "We couldn't generate a custom quiz. Using a pre-made quiz instead.",
        })

        const fallbackQuiz = generateFallbackQuiz(customCategory)
        addDynamicQuiz(fallbackQuiz)
        router.push(`/quiz/${fallbackQuiz.id}`)
      }
    } catch (error) {
      console.error("Error generating quiz:", error)

      // Create fallback quiz
      const fallbackQuiz = generateFallbackQuiz(customCategory)
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center">
          <Button variant="outline" onClick={() => router.push("/")} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-3xl font-bold flex items-center">
            <Sparkles className="mr-2 h-6 w-6 text-green-600" /> Generate Custom Quiz
          </h1>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Create a Unique Quiz with AI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category">Quiz Category</Label>
                <Input
                  id="category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="E.g., Nigerian Literature, Nollywood Movies, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt" className="flex justify-between">
                  <span>Custom Prompt (Optional)</span>
                  <span className="text-xs text-gray-500">Provide specific instructions for the AI</span>
                </Label>
                <Textarea
                  id="prompt"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="E.g., Focus on contemporary Nigerian authors, include questions about their famous works..."
                  className="min-h-[100px]"
                />
              </div>

              <Button
                onClick={handleGenerateQuiz}
                disabled={isGenerating || !customCategory}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Quiz...
                  </>
                ) : (
                  <>
                    Generate Custom Quiz <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">How It Works</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Enter a category for your quiz (e.g., Nigerian Literature, Nollywood Movies)</li>
              <li>Optionally, provide specific instructions to customize your quiz</li>
              <li>Click "Generate Custom Quiz" to create a unique set of questions</li>
              <li>Take the quiz and test your knowledge!</li>
            </ol>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              Each quiz is uniquely generated using AI technology, so you'll get different questions every time.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

