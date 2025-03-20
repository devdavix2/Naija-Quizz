"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Award, History, Music, Utensils, MapPin, MessageSquare } from "lucide-react"

export default function QuizCategoriesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const categories = [
    {
      id: "nigerian-culture",
      title: "Nigerian Culture",
      description: "Test your knowledge about Nigerian traditions, festivals, and cultural practices.",
      questionCount: 10,
      timeLimit: 300,
      icon: Award,
      color: "from-green-500 to-green-700",
      delay: 0,
    },
    {
      id: "nigerian-history",
      title: "Nigerian History",
      description: "How well do you know the rich history of Nigeria from pre-colonial times to present?",
      questionCount: 15,
      timeLimit: 480,
      icon: History,
      color: "from-blue-500 to-blue-700",
      delay: 0.1,
    },
    {
      id: "nigerian-food",
      title: "Nigerian Cuisine",
      description: "From jollof rice to egusi soup, test your knowledge of Nigerian delicacies.",
      questionCount: 8,
      timeLimit: 240,
      icon: Utensils,
      color: "from-orange-500 to-orange-700",
      delay: 0.2,
    },
    {
      id: "nigerian-music",
      title: "Nigerian Music",
      description: "How well do you know Nigerian artists, songs, and musical traditions?",
      questionCount: 12,
      timeLimit: 360,
      icon: Music,
      color: "from-purple-500 to-purple-700",
      delay: 0.3,
    },
    {
      id: "nigerian-slang",
      title: "Nigerian Slang",
      description: "Test your knowledge of popular Nigerian slang and expressions.",
      questionCount: 10,
      timeLimit: 300,
      icon: MessageSquare,
      color: "from-pink-500 to-pink-700",
      delay: 0.4,
    },
    {
      id: "nigerian-geography",
      title: "Nigerian Geography",
      description: "Test your knowledge of Nigerian states, landmarks, and geographical features.",
      questionCount: 15,
      timeLimit: 480,
      icon: MapPin,
      color: "from-teal-500 to-teal-700",
      delay: 0.5,
    },
  ]

  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Quiz Categories</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Dive into various aspects of Nigerian culture through our diverse quiz categories.
            </p>
          </motion.div>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: category.delay }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                  <div className={`h-40 bg-gradient-to-r ${category.color} relative`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="h-16 w-16 text-white opacity-50" />
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {category.questionCount} questions • {Math.ceil(category.timeLimit / 60)} mins
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/quiz?category=${category.id}`} className="w-full">
                      <Button className={`w-full bg-gradient-to-r ${category.color} hover:opacity-90`}>
                        Start Quiz <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

