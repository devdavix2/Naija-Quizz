"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Award, CheckCircle, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function HeroSection() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const rotatingTexts = ["Culture", "History", "Food", "Music", "Geography"]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[30%] -right-[10%] h-[500px] w-[500px] rounded-full bg-green-200/20 blur-3xl"></div>
        <div className="absolute top-[60%] -left-[10%] h-[400px] w-[400px] rounded-full bg-yellow-200/20 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge className="mb-4 px-4 py-1 text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                Nigeria's #1 Quiz Platform
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Discover Nigerian{" "}
              <span className="relative inline-block">
                <span className="text-green-600 dark:text-green-400">{rotatingTexts[currentTextIndex]}</span>
                <span className="absolute bottom-0 left-0 w-full h-2 bg-green-200 dark:bg-green-800 -z-10 rounded"></span>
              </span>{" "}
              Through Fun Quizzes
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Test your knowledge, earn badges, compete on leaderboards, and explore the rich cultural heritage of
              Nigeria.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link href="/quiz/nigerian-culture">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg">
                  Start a Quiz <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span>100+ Quizzes</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span>5 Languages</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span>10,000+ Users</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="flex-1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-yellow-200 rounded-lg -z-10 dark:bg-yellow-700/30"></div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-green-200 rounded-lg -z-10 dark:bg-green-700/30"></div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="bg-green-600 p-4 text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="h-6 w-6 mr-2" />
                    <h3 className="font-bold">Nigerian Culture Quiz</h3>
                  </div>
                  <Badge className="bg-white text-green-600">Featured</Badge>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">
                      Which Nigerian festival is celebrated to mark the beginning of the yam harvest season?
                    </h4>
                    <div className="space-y-3">
                      {["Durbar Festival", "Eyo Festival", "New Yam Festival", "Osun-Osogbo Festival"].map(
                        (option, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-md border ${
                              index === 2
                                ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                            } cursor-pointer transition-colors`}
                          >
                            {option}
                            {index === 2 && <CheckCircle className="h-5 w-5 text-green-600 float-right" />}
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Question 1 of 10</div>
                    <Button className="bg-green-600 hover:bg-green-700">
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

