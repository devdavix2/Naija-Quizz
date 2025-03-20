"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Award, BarChart3, Languages, Trophy, Sparkles, Zap } from "lucide-react"

export default function FeatureSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const features = [
    {
      icon: <Sparkles className="h-10 w-10 text-green-600" />,
      title: "AI-Generated Quizzes",
      description: "Create unique quizzes on Nigerian topics using AI technology for fresh content every time.",
      delay: 0,
    },
    {
      icon: <Trophy className="h-10 w-10 text-green-600" />,
      title: "Track Your Progress",
      description: "Monitor your performance and see how your knowledge improves over time with detailed statistics.",
      delay: 0.1,
    },
    {
      icon: <Award className="h-10 w-10 text-green-600" />,
      title: "Earn Badges & Achievements",
      description: "Unlock special badges and achievements as you complete quizzes and improve your knowledge.",
      delay: 0.2,
    },
    {
      icon: <Languages className="h-10 w-10 text-green-600" />,
      title: "Multiple Language Options",
      description: "Take quizzes in English, Pidgin, Yoruba, Igbo, or Hausa to match your language preference.",
      delay: 0.3,
    },
    {
      icon: <Zap className="h-10 w-10 text-green-600" />,
      title: "Offline Functionality",
      description: "Access and take quizzes even without an internet connection with our offline mode.",
      delay: 0.4,
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-green-600" />,
      title: "Detailed Analytics",
      description: "Track your progress with comprehensive statistics and performance insights across categories.",
      delay: 0.5,
    },
  ]

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Packed with Amazing Features</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              NaijaSpark Quiz offers a comprehensive platform to explore Nigerian culture while having fun.
            </p>
          </motion.div>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: feature.delay }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-full inline-block mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

