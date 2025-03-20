/**
 * Enhanced client-side data store using localStorage
 * This version includes more front-end features without any backend dependencies
 */
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { quizData } from "./quiz-data"
import type { Quiz, QuizResult, QuizFavorite, QuizNote } from "@/types/app-types"

// Define the store state interface
interface StoreState {
  // Theme and preferences
  theme: "light" | "dark" | "system"
  preferredLanguage: string
  offlineMode: boolean

  // API key for Gemini
  geminiApiKey: string

  // Dynamic quizzes
  dynamicQuizzes: Quiz[]

  // Quiz data
  quizResults: QuizResult[]
  favorites: QuizFavorite[]
  notes: QuizNote[]
  lastQuizAttempt: {
    quizId: string
    answers: string[]
    currentQuestionIndex: number
    timeLeft: number
  } | null

  // Actions
  setTheme: (theme: "light" | "dark" | "system") => void
  setPreferredLanguage: (language: string) => void
  toggleOfflineMode: () => void
  setGeminiApiKey: (apiKey: string) => void

  // Quiz actions
  saveQuizResult: (result: QuizResult) => void
  clearQuizHistory: () => void
  getQuizById: (id: string) => Quiz | undefined
  toggleFavorite: (quizId: string) => void
  isFavorite: (quizId: string) => boolean
  getFavorites: () => Quiz[]

  // Dynamic quiz actions
  addDynamicQuiz: (quiz: Quiz) => void
  getDynamicQuizzes: () => Quiz[]
  clearDynamicQuizzes: () => void

  // Notes actions
  addNote: (quizId: string, note: string) => void
  updateNote: (id: string, note: string) => void
  deleteNote: (id: string) => void
  getNotesForQuiz: (quizId: string) => QuizNote[]

  // Progress tracking
  saveQuizProgress: (quizId: string, answers: string[], currentQuestionIndex: number, timeLeft: number) => void
  getQuizProgress: (quizId: string) => { answers: string[]; currentQuestionIndex: number; timeLeft: number } | null
  clearQuizProgress: (quizId: string) => void

  // Statistics
  getStatistics: () => {
    totalQuizzesTaken: number
    averageScore: number
    bestCategory: string | null
    worstCategory: string | null
    quizzesByCategory: Record<string, number>
    recentResults: QuizResult[]
  }
}

// Create the store with persistence
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: "system",
      preferredLanguage: "english",
      offlineMode: false,
      geminiApiKey: "AIzaSyD3xqa0_R3IZY24rDxGBFOKleeGyEKYIoU",
      dynamicQuizzes: [],
      quizResults: [],
      favorites: [],
      notes: [],
      lastQuizAttempt: null,

      // Theme and preferences actions
      setTheme: (theme) => set({ theme }),
      setPreferredLanguage: (language) => set({ preferredLanguage: language }),
      toggleOfflineMode: () => set((state) => ({ offlineMode: !state.offlineMode })),
      setGeminiApiKey: (apiKey) => set({ geminiApiKey: apiKey }),

      // Quiz result actions
      saveQuizResult: (result) => {
        set((state) => ({
          quizResults: [result, ...state.quizResults],
          // Clear any saved progress for this quiz
          lastQuizAttempt: state.lastQuizAttempt?.quizId === result.quizId ? null : state.lastQuizAttempt,
        }))
      },

      clearQuizHistory: () => set({ quizResults: [] }),

      getQuizById: (id) => {
        // First check dynamic quizzes
        const dynamicQuiz = get().dynamicQuizzes.find((quiz) => quiz.id === id)
        if (dynamicQuiz) return dynamicQuiz

        // Then check static quizzes
        return quizData.find((quiz) => quiz.id === id)
      },

      // Dynamic quiz actions
      addDynamicQuiz: (quiz) => {
        set((state) => ({
          dynamicQuizzes: [quiz, ...state.dynamicQuizzes],
        }))
      },

      getDynamicQuizzes: () => {
        return get().dynamicQuizzes
      },

      clearDynamicQuizzes: () => {
        set({ dynamicQuizzes: [] })
      },

      // Favorites management
      toggleFavorite: (quizId) => {
        set((state) => {
          const isFavorited = state.favorites.some((fav) => fav.quizId === quizId)

          if (isFavorited) {
            return {
              favorites: state.favorites.filter((fav) => fav.quizId !== quizId),
            }
          } else {
            // Check both dynamic and static quizzes
            const quiz = state.dynamicQuizzes.find((q) => q.id === quizId) || quizData.find((q) => q.id === quizId)

            if (!quiz) return state

            return {
              favorites: [
                ...state.favorites,
                {
                  quizId,
                  title: quiz.title,
                  category: quiz.category,
                  addedAt: new Date().toISOString(),
                },
              ],
            }
          }
        })
      },

      isFavorite: (quizId) => {
        return get().favorites.some((fav) => fav.quizId === quizId)
      },

      getFavorites: () => {
        const favorites = get().favorites
        const dynamicQuizzes = get().dynamicQuizzes

        return favorites
          .map((fav) => {
            // Check dynamic quizzes first
            const dynamicQuiz = dynamicQuizzes.find((q) => q.id === fav.quizId)
            if (dynamicQuiz) return dynamicQuiz

            // Then check static quizzes
            const staticQuiz = quizData.find((q) => q.id === fav.quizId)
            return staticQuiz
          })
          .filter(Boolean) as Quiz[]
      },

      // Notes management
      addNote: (quizId, note) => {
        set((state) => ({
          notes: [
            ...state.notes,
            {
              id: `note_${Date.now()}`,
              quizId,
              note,
              createdAt: new Date().toISOString(),
            },
          ],
        }))
      },

      updateNote: (id, note) => {
        set((state) => ({
          notes: state.notes.map((n) => (n.id === id ? { ...n, note, updatedAt: new Date().toISOString() } : n)),
        }))
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        }))
      },

      getNotesForQuiz: (quizId) => {
        return get().notes.filter((note) => note.quizId === quizId)
      },

      // Progress tracking
      saveQuizProgress: (quizId, answers, currentQuestionIndex, timeLeft) => {
        set({
          lastQuizAttempt: {
            quizId,
            answers,
            currentQuestionIndex,
            timeLeft,
          },
        })
      },

      getQuizProgress: (quizId) => {
        const progress = get().lastQuizAttempt
        if (progress && progress.quizId === quizId) {
          return {
            answers: progress.answers,
            currentQuestionIndex: progress.currentQuestionIndex,
            timeLeft: progress.timeLeft,
          }
        }
        return null
      },

      clearQuizProgress: (quizId) => {
        set((state) => ({
          lastQuizAttempt: state.lastQuizAttempt?.quizId === quizId ? null : state.lastQuizAttempt,
        }))
      },

      // Statistics
      getStatistics: () => {
        const results = get().quizResults

        if (results.length === 0) {
          return {
            totalQuizzesTaken: 0,
            averageScore: 0,
            bestCategory: null,
            worstCategory: null,
            quizzesByCategory: {},
            recentResults: [],
          }
        }

        // Calculate total quizzes taken
        const totalQuizzesTaken = results.length

        // Calculate average score
        const totalScore = results.reduce((sum, result) => sum + (result.score / result.totalQuestions) * 100, 0)
        const averageScore = Math.round(totalScore / totalQuizzesTaken)

        // Group results by category
        const categoryResults: Record<string, { total: number; correct: number; count: number }> = {}

        results.forEach((result) => {
          // Get quiz from both dynamic and static sources
          const dynamicQuizzes = get().dynamicQuizzes
          const quiz =
            dynamicQuizzes.find((q) => q.id === result.quizId) || quizData.find((q) => q.id === result.quizId)

          if (!quiz) return

          const category = quiz.category
          if (!categoryResults[category]) {
            categoryResults[category] = { total: 0, correct: 0, count: 0 }
          }

          categoryResults[category].total += result.totalQuestions
          categoryResults[category].correct += result.score
          categoryResults[category].count += 1
        })

        // Calculate best and worst categories
        let bestCategory = null
        let worstCategory = null
        let bestScore = -1
        let worstScore = 101

        Object.entries(categoryResults).forEach(([category, data]) => {
          const score = Math.round((data.correct / data.total) * 100)

          if (score > bestScore) {
            bestScore = score
            bestCategory = category
          }

          if (score < worstScore) {
            worstScore = score
            worstCategory = category
          }
        })

        // Count quizzes by category
        const quizzesByCategory: Record<string, number> = {}
        Object.entries(categoryResults).forEach(([category, data]) => {
          quizzesByCategory[category] = data.count
        })

        // Get recent results (last 5)
        const recentResults = results.slice(0, 5)

        return {
          totalQuizzesTaken,
          averageScore,
          bestCategory,
          worstCategory,
          quizzesByCategory,
          recentResults,
        }
      },
    }),
    {
      name: "naijaspark-storage", // localStorage key
      partialize: (state) => ({
        theme: state.theme,
        preferredLanguage: state.preferredLanguage,
        offlineMode: state.offlineMode,
        geminiApiKey: state.geminiApiKey,
        dynamicQuizzes: state.dynamicQuizzes,
        quizResults: state.quizResults,
        favorites: state.favorites,
        notes: state.notes,
        lastQuizAttempt: state.lastQuizAttempt,
      }),
    },
  ),
)

