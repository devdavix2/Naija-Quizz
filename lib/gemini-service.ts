/**
 * Client-side service for generating quizzes using Gemini API
 * This allows for dynamic quiz content without backend dependencies
 */

import type { Quiz, QuizQuestion } from "@/types/app-types"

// Categories for quiz generation
const QUIZ_CATEGORIES = [
  "Nigerian Culture",
  "Nigerian History",
  "Nigerian Food",
  "Nigerian Music",
  "Nigerian Geography",
  "Nigerian Literature",
  "Nigerian Politics",
  "Nigerian Sports",
  "Nigerian Languages",
  "Nigerian Art",
]

// Sample prompts for different quiz categories
const CATEGORY_PROMPTS: Record<string, string> = {
  "Nigerian Culture":
    "Generate 10 multiple-choice questions about Nigerian traditions, festivals, and cultural practices.",
  "Nigerian History":
    "Generate 10 multiple-choice questions about Nigerian history from pre-colonial times to present.",
  "Nigerian Food": "Generate 8 multiple-choice questions about Nigerian cuisine, dishes, and cooking traditions.",
  "Nigerian Music":
    "Generate 10 multiple-choice questions about Nigerian musicians, music genres, and musical history.",
  "Nigerian Geography":
    "Generate 10 multiple-choice questions about Nigerian states, landmarks, and geographical features.",
  "Nigerian Literature": "Generate 8 multiple-choice questions about Nigerian authors, books, and literary traditions.",
  "Nigerian Politics":
    "Generate 8 multiple-choice questions about Nigerian political system, leaders, and political history.",
  "Nigerian Sports": "Generate 8 multiple-choice questions about Nigerian sports, athletes, and sporting achievements.",
  "Nigerian Languages":
    "Generate 8 multiple-choice questions about Nigerian languages, dialects, and linguistic features.",
  "Nigerian Art": "Generate 8 multiple-choice questions about Nigerian art, artists, and artistic traditions.",
}

// Function to generate a quiz using the free Gemini API model (Gemini 1.5 Flash)
export async function generateQuiz(category: string, apiKey: string): Promise<Quiz | null> {
  try {
    const prompt = CATEGORY_PROMPTS[category] || `Generate 8 multiple-choice questions about ${category} in Nigeria.`

    // Create a more structured prompt to help the model generate valid JSON
    const structuredPrompt = `
      ${prompt}
      
      I need the response in a specific JSON format. Please provide an array of question objects with this exact structure:
      [
        {
          "question": "What is the capital of Nigeria?",
          "options": ["Lagos", "Abuja", "Kano", "Port Harcourt"],
          "correctAnswer": "Abuja"
        },
        ...more questions
      ]
      
      Important guidelines:
      - Each question must have exactly 4 options
      - Only one option should be the correct answer
      - The correctAnswer must be exactly the same as one of the options
      - Make sure all questions are factually accurate about Nigeria
      - Return ONLY the JSON array, no other text
    `

    console.log("Sending request to Gemini API using free model (gemini-1.5-flash)...")

    // Note the updated URL using the free Gemini 1.5 Flash model
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: structuredPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096,
          },
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Gemini API error:", errorData)
      throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    console.log("Received response from Gemini API:", data)

    if (!data.candidates || data.candidates.length === 0) {
      console.error("No candidates in Gemini API response")
      return null
    }

    const textContent = data.candidates[0].content.parts[0].text
    console.log("Raw text content:", textContent)

    // Try different approaches to extract JSON
    let questions: QuizQuestion[] = []

    try {
      // First attempt: Try to parse the entire text as JSON
      questions = JSON.parse(textContent.trim())
    } catch (e) {
      console.log("Could not parse entire text as JSON, trying to extract JSON...")

      // Second attempt: Try to extract JSON using regex
      const jsonMatch = textContent.match(/\[\s*\{[\s\S]*\}\s*\]/)
      if (jsonMatch) {
        try {
          questions = JSON.parse(jsonMatch[0])
        } catch (e2) {
          console.error("Could not parse extracted JSON:", e2)
          return null
        }
      } else {
        console.error("Could not extract JSON from response")
        return null
      }
    }

    // Validate questions
    if (!Array.isArray(questions) || questions.length === 0) {
      console.error("Invalid questions format or empty array")
      return null
    }

    console.log("Successfully parsed questions:", questions)

    // Create quiz object
    const quiz: Quiz = {
      id: `${category.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      title: category,
      description: `Test your knowledge about ${category.toLowerCase()} with this dynamically generated quiz.`,
      category: category.split(" ")[0], // Use first word as category
      timeLimit: questions.length * 30, // 30 seconds per question
      questions: questions,
      availableLanguages: ["english"],
      relatedQuizzes: getRelatedQuizzes(category),
    }

    return quiz
  } catch (error) {
    console.error("Error generating quiz:", error)
    return null
  }
}

// Function to get related quizzes
function getRelatedQuizzes(currentCategory: string): { id: string; title: string }[] {
  // Filter out current category and get 2 random categories
  const otherCategories = QUIZ_CATEGORIES.filter((cat) => cat !== currentCategory)
  const shuffled = otherCategories.sort(() => 0.5 - Math.random())
  const selected = shuffled.slice(0, 2)

  return selected.map((cat) => ({
    id: cat.toLowerCase().replace(/\s+/g, "-"),
    title: cat,
  }))
}

// Function to get available quiz categories
export function getQuizCategories(): string[] {
  return QUIZ_CATEGORIES
}

// Function to generate a fallback quiz if API fails
export function generateFallbackQuiz(category: string): Quiz {
  // More comprehensive fallback questions
  const fallbackQuestions: QuizQuestion[] = [
    {
      question: `What is a popular aspect of ${category.toLowerCase()} in Nigeria?`,
      options: ["Traditional practices", "Modern innovations", "Foreign influences", "Historical developments"],
      correctAnswer: "Traditional practices",
    },
    {
      question: `Which of these is most closely related to ${category.toLowerCase()} in Nigeria?`,
      options: ["Cultural heritage", "Economic factors", "Political movements", "Geographical features"],
      correctAnswer: "Cultural heritage",
    },
    {
      question: `When did ${category.toLowerCase()} become significant in Nigerian society?`,
      options: ["Pre-colonial era", "Colonial period", "Post-independence", "21st century"],
      correctAnswer: "Pre-colonial era",
    },
    {
      question: `Which Nigerian region is most known for its contributions to ${category.toLowerCase()}?`,
      options: ["Southwest", "Southeast", "North", "Niger Delta"],
      correctAnswer: "Southwest",
    },
    {
      question: `How has ${category.toLowerCase()} evolved in modern Nigeria?`,
      options: [
        "Maintained traditional forms",
        "Blended with Western influences",
        "Been largely forgotten",
        "Remained unchanged",
      ],
      correctAnswer: "Blended with Western influences",
    },
  ]

  return {
    id: `${category.toLowerCase().replace(/\s+/g, "-")}-fallback-${Date.now()}`,
    title: category,
    description: `Test your knowledge about ${category.toLowerCase()} with this quiz.`,
    category: category.split(" ")[0],
    timeLimit: fallbackQuestions.length * 30,
    questions: fallbackQuestions,
    availableLanguages: ["english"],
    relatedQuizzes: getRelatedQuizzes(category),
  }
}

