import {
  dummyQuizCategories,
  dummyFeaturedQuizzes,
  dummyQuizData,
  dummyLeaderboard,
  dummyQuizStatistics,
  dummyQuizRecommendations,
} from "@/lib/dummy-data"
import type { Quiz, QuizCategory, QuizRecommendation } from "@/types/quiz"
import type { LeaderboardEntry } from "@/types/leaderboard"

// Get all quiz categories
export async function getQuizCategories(): Promise<QuizCategory[]> {
  // Return dummy data
  return dummyQuizCategories
}

// Get top categories by completion count
export async function getTopCategories(limit = 3): Promise<QuizCategory[]> {
  // Return top categories from dummy data
  return dummyQuizCategories.slice(0, limit)
}

// Get featured quizzes
export async function getFeaturedQuizzes() {
  // Return dummy featured quizzes
  return dummyFeaturedQuizzes
}

// Get quiz by ID
export async function getQuizById(id: string): Promise<Quiz | null> {
  // Return dummy quiz data by ID
  return dummyQuizData[id] || null
}

// Get leaderboard
export async function getLeaderboard(limit = 20): Promise<LeaderboardEntry[]> {
  // Return dummy leaderboard data
  return dummyLeaderboard.slice(0, limit)
}

// Get quiz statistics
export async function getQuizStatistics() {
  // Return dummy quiz statistics
  return dummyQuizStatistics
}

// Get recommended quizzes for a user
export async function getRecommendedQuizzes(userId: string): Promise<QuizRecommendation[]> {
  // Return dummy quiz recommendations
  return dummyQuizRecommendations
}

