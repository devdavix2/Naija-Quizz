"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import ResultsDisplay from "@/components/results-display"
import { useStore } from "@/lib/store"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function ResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get query parameters
  const quizId = searchParams?.get("quizId") || ""
  const score = Number.parseInt(searchParams?.get("score") || "0")
  const total = Number.parseInt(searchParams?.get("total") || "0")
  const language = searchParams?.get("language") || "english"

  // Calculate percentage
  const percentage = Math.round((score / total) * 100)

  // Get quiz data from store
  const getQuizById = useStore((state) => state.getQuizById)
  const quiz = getQuizById(quizId)

  // Redirect if quiz not found or parameters are invalid
  useEffect(() => {
    if (!quiz || !quizId || !score || !total) {
      router.push("/")
    }
  }, [quiz, quizId, score, total, router])

  // Show loading state while checking if quiz exists
  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8">
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4 mx-auto" />
                <Skeleton className="h-20 w-20 rounded-full mx-auto" />
                <Skeleton className="h-12 w-1/3 mx-auto" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between pt-4">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
      <div className="container mx-auto px-4 py-8">
        <ResultsDisplay quiz={quiz} score={score} total={total} percentage={percentage} language={language} />
      </div>
    </div>
  )
}

