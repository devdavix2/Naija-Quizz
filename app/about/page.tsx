"use client"

import { Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"

// Example component that might use useSearchParams
function AboutContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">About NaijaSpark Quiz</h1>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg mb-4">
          NaijaSpark Quiz is an interactive platform designed to help people learn about Nigerian culture, history,
          food, music, and more through engaging quizzes.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
        <p>
          Our mission is to promote Nigerian culture and heritage through fun, educational quizzes that challenge your
          knowledge and help you learn new facts about Nigeria's rich cultural tapestry.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">How It Works</h2>
        <p>
          NaijaSpark Quiz offers multiple quiz categories covering different aspects of Nigerian culture. Each quiz
          contains carefully crafted questions with multiple-choice answers. After completing a quiz, you'll receive
          immediate feedback on your performance.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Features</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Multiple quiz categories covering various aspects of Nigerian culture</li>
          <li>Quizzes available in multiple Nigerian languages</li>
          <li>Immediate feedback on quiz performance</li>
          <li>Timed quizzes to add an element of challenge</li>
          <li>Shareable results to compare with friends</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
        <p>
          Have suggestions for new quiz topics or questions? We'd love to hear from you! Contact us at{" "}
          <a href="mailto:info@naijasparkquiz.com" className="text-green-600 hover:underline">
            info@naijasparkquiz.com
          </a>
          .
        </p>
      </div>
    </div>
  )
}

export default function AboutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AboutContent />
    </Suspense>
  )
}