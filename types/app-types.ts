/**
 * Application type definitions
 * These types are used throughout the application for consistent data structures
 */

// Quiz related types
export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: string
  translations?: {
    [language: string]: {
      question: string
      options: string[]
    }
  }
}

export interface Quiz {
  id: string
  title: string
  description: string
  category: string
  timeLimit: number
  questions: QuizQuestion[]
  availableLanguages?: string[]
  relatedQuizzes?: {
    id: string
    title: string
  }[]
}

export interface QuizCategory {
  id: string
  title: string
  description: string
  questionCount: number
  timeLimit: number
}

export interface QuizResult {
  quizId: string
  quizTitle: string
  score: number
  totalQuestions: number
  date: string
}

export interface QuizFavorite {
  quizId: string
  title: string
  category: string
  addedAt: string
}

export interface QuizNote {
  id: string
  quizId: string
  note: string
  createdAt: string
  updatedAt?: string
}

export interface QuizRecommendation {
  id: string
  title: string
  description: string
  category: string
  matchPercentage: number
  reason: string
}

// User related types
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

// Leaderboard related types
export interface LeaderboardEntry {
  userId: string
  userName: string
  userImage?: string
  quizId: string
  quizTitle: string
  quizCategory: string
  score: number
  totalQuestions: number
  badge: string
  date: string
}

// Community related types
export interface Discussion {
  id: string
  title: string
  content: string
  likes: number
  comments: number
  date: string
  userId: string
  userName: string
  userImage?: string
  userBadge: string
}

export interface Comment {
  id: string
  content: string
  date: string
  userId: string
  userName: string
  userImage?: string
  userBadge: string
}

