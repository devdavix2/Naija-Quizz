export interface UserStats {
  quizzesCompleted: number
  averageScore: number
  totalPoints: number
}

export interface UserPreferences {
  language: string
}

export interface QuizHistoryItem {
  quizId: string
  quizTitle: string
  quizCategory: string
  score: number
  totalQuestions: number
  date: string
}

export interface CategoryPerformance {
  categoryName: string
  averageScore: number
  quizCount: number
}

export interface UserProfile {
  stats: UserStats
  badges: string[]
  preferences: UserPreferences
  quizHistory: QuizHistoryItem[]
  categoryPerformance: CategoryPerformance[]
}

