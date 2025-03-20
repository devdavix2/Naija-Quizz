"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import QuizInterface from "@/components/quiz-interface"
import { useStore } from "@/lib/store"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function QuizPage() {
  const router = useRouter()
  const { category } = useParams() as { category: string }

  // Get quiz data from store
  const getQuizById = useStore((state) => state.getQuizById)
  const quiz = getQuizById(category)

  // Redirect if quiz not found
  useEffect(() => {
    if (!quiz) {
      router.push("/")
    }
  }, [quiz, router])

  // Show loading state while checking if quiz exists
  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8">
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
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
        <QuizInterface quiz={quiz} />
      </div>
    </div>
  )
}

