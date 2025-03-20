"use server"

// Submit quiz result
export async function submitQuizResult(data: {
  quizId: string
  userId: string
  score: number
  totalQuestions: number
  timeSpent: number
  language: string
}) {
  // In dummy mode, just return success
  return { success: true }
}

