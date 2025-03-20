"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Search, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { quizData } from "@/lib/quiz-data"
import { motion } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import type { Quiz } from "@/types/app-types"

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get initial search query from URL
  const initialQuery = searchParams?.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([])
  const [showFilters, setShowFilters] = useState(false)

  // Filter options
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [minQuestions, setMinQuestions] = useState<number>(0)
  const [maxTime, setMaxTime] = useState<number>(0)
  const [hasMultipleLanguages, setHasMultipleLanguages] = useState(false)

  // Get unique categories
  const categories = Array.from(new Set(quizData.map((quiz) => quiz.category)))

  // Filter quizzes based on search query and filters
  useEffect(() => {
    let filtered = quizData

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(query) ||
          quiz.description.toLowerCase().includes(query) ||
          quiz.category.toLowerCase().includes(query),
      )
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((quiz) => quiz.category === selectedCategory)
    }

    // Apply minimum questions filter
    if (minQuestions > 0) {
      filtered = filtered.filter((quiz) => quiz.questions.length >= minQuestions)
    }

    // Apply maximum time filter
    if (maxTime > 0) {
      filtered = filtered.filter((quiz) => Math.ceil(quiz.timeLimit / 60) <= maxTime)
    }

    // Apply language filter
    if (hasMultipleLanguages) {
      filtered = filtered.filter((quiz) => quiz.availableLanguages && quiz.availableLanguages.length > 1)
    }

    setFilteredQuizzes(filtered)
  }, [searchQuery, selectedCategory, minQuestions, maxTime, hasMultipleLanguages])

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Update URL with search query
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center">
          <Button variant="outline" onClick={() => router.push("/")} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-3xl font-bold flex items-center">
            <Search className="mr-2 h-6 w-6 text-green-600" /> Search Quizzes
          </h1>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              aria-label="Toggle filters"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </form>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Filter Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="min-questions">Minimum Questions</Label>
                    <Select
                      value={minQuestions.toString()}
                      onValueChange={(value) => setMinQuestions(Number.parseInt(value))}
                    >
                      <SelectTrigger id="min-questions">
                        <SelectValue placeholder="Minimum questions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Any</SelectItem>
                        <SelectItem value="5">At least 5</SelectItem>
                        <SelectItem value="10">At least 10</SelectItem>
                        <SelectItem value="15">At least 15</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="max-time">Maximum Time (minutes)</Label>
                    <Select value={maxTime.toString()} onValueChange={(value) => setMaxTime(Number.parseInt(value))}>
                      <SelectTrigger id="max-time">
                        <SelectValue placeholder="Maximum time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Any</SelectItem>
                        <SelectItem value="5">5 minutes or less</SelectItem>
                        <SelectItem value="10">10 minutes or less</SelectItem>
                        <SelectItem value="15">15 minutes or less</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="multiple-languages"
                      checked={hasMultipleLanguages}
                      onCheckedChange={(checked) => setHasMultipleLanguages(checked === true)}
                    />
                    <Label htmlFor="multiple-languages">Multiple languages available</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("all")
                    setMinQuestions(0)
                    setMaxTime(0)
                    setHasMultipleLanguages(false)
                  }}
                >
                  Reset Filters
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* Search results */}
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-300">
            {filteredQuizzes.length} {filteredQuizzes.length === 1 ? "result" : "results"} found
          </p>
          <Separator className="my-2" />
        </div>

        {filteredQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <Badge variant="outline" className="w-fit">
                      {quiz.category}
                    </Badge>
                  </CardHeader>
                  <CardContent className="pb-4 flex-grow">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{quiz.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>{quiz.questions.length} questions</span>
                      <span>{Math.ceil(quiz.timeLimit / 60)} mins</span>
                    </div>
                    {quiz.availableLanguages && quiz.availableLanguages.length > 1 && (
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {quiz.availableLanguages.length} languages
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => router.push(`/quiz/${quiz.id}`)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Start Quiz <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No quizzes found</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button onClick={() => router.push("/")} className="bg-green-600 hover:bg-green-700">
              Browse All Quizzes
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

