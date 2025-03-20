// Types
type QuizResult = {
  quizId: string
  quizTitle: string
  score: number
  totalQuestions: number
  date: string
}

type LeaderboardEntry = QuizResult & {
  badge: string
}

// Save quiz result to history
export const saveQuizResult = (result: QuizResult) => {
  if (typeof window === "undefined") return

  const history = getQuizHistory()
  history.unshift(result) // Add to beginning of array
  localStorage.setItem("quizHistory", JSON.stringify(history))
}

// Get quiz history
export const getQuizHistory = (): QuizResult[] => {
  if (typeof window === "undefined") return []

  const history = localStorage.getItem("quizHistory")
  return history ? JSON.parse(history) : []
}

// Clear quiz history
export const clearQuizHistory = () => {
  if (typeof window === "undefined") return

  localStorage.removeItem("quizHistory")
}

// Update leaderboard
export const updateLeaderboard = (entry: LeaderboardEntry) => {
  if (typeof window === "undefined") return

  try {
    const leaderboardStr = localStorage.getItem("leaderboard")
    const leaderboard = leaderboardStr ? JSON.parse(leaderboardStr) : []

    // Check if this quiz already exists in leaderboard
    const existingEntryIndex = leaderboard.findIndex((item: LeaderboardEntry) => item.quizId === entry.quizId)

    if (existingEntryIndex !== -1) {
      // If the new score is better, replace the entry
      const existingEntry = leaderboard[existingEntryIndex]
      const existingPercentage = (existingEntry.score / existingEntry.totalQuestions) * 100
      const newPercentage = (entry.score / entry.totalQuestions) * 100

      if (newPercentage > existingPercentage) {
        leaderboard[existingEntryIndex] = entry
      }
    } else {
      // Add new entry
      leaderboard.push(entry)
    }

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard))
  } catch (error) {
    console.error("Error updating leaderboard:", error)
  }
}

// Get leaderboard
export const getLeaderboard = (): LeaderboardEntry[] => {
  if (typeof window === "undefined") return []

  const leaderboard = localStorage.getItem("leaderboard")
  return leaderboard ? JSON.parse(leaderboard) : []
}

