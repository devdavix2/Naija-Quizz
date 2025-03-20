"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Search, Github, Twitter } from "lucide-react"
import HeroSection from "@/components/landing/hero-section"
import FeatureSection from "@/components/landing/feature-section"
import TestimonialsSection from "@/components/landing/testimonials-section"
import StatsSection from "@/components/landing/stats-section"
import FaqSection from "@/components/landing/faq-section"
import NewsletterSection from "@/components/landing/newsletter-section"
import QuizPreviewSection from "@/components/landing/quiz-preview-section"
import { QuizGenerator } from "@/components/quiz-generator"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Quiz Generator Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Generate Custom Quizzes</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Create unique quizzes on Nigerian topics using AI technology.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <QuizGenerator />
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <FeatureSection />

      {/* Quiz Preview Section */}
      <QuizPreviewSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FaqSection />

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Final CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Test Your Nigerian Knowledge?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Explore Nigerian culture through our interactive quizzes!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quiz/nigerian-culture">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg">
                Start a Quiz <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/search">
              <Button size="lg" variant="outline" className="text-lg">
                <Search className="mr-2 h-5 w-5" /> Search Quizzes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 flex justify-center items-center gap-4">
            Developed by{" "}
            <Link href="https://github.com/devdavix2" className="flex items-center gap-1 underline hover:text-green-600">
              <Github className="h-5 w-5" /> devdavix
            </Link>
            {" | "}
            <Link href="https://twitter.com/devdavix" className="flex items-center gap-1 underline hover:text-green-600">
              <Twitter className="h-5 w-5" /> @devdavix
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}

