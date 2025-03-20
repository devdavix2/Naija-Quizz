"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Award, Brain, Users } from "lucide-react"

export default function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const stats = [
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      value: "10,000+",
      label: "Active Users",
      delay: 0,
    },
    {
      icon: <Brain className="h-8 w-8 text-green-600" />,
      value: "100+",
      label: "Unique Quizzes",
      delay: 0.1,
    },
    {
      icon: <Award className="h-8 w-8 text-green-600" />,
      value: "50,000+",
      label: "Badges Earned",
      delay: 0.2,
    },
  ]

  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: stat.delay }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/30 rounded-full">{stat.icon}</div>
              <h3 className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</h3>
              <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

