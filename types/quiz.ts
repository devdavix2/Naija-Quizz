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

export interface QuizCategory {
  id: string
  title: string
  description: string
  questionCount: number
  timeLimit: number
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

export interface QuizRecommendation {
  id: string
  title: string
  description: string
  category: string
  matchPercentage: number
  reason: string
}

