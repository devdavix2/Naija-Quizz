"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Bookmark, BookmarkCheck, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import type { Quiz } from "@/types/app-types"

export default function FavoritesPage() {
  const router = useRouter()
  const getFavorites = useStore((state) => state.getFavorites)
  const toggleFavorite = useStore((state) => state.toggleFavorite)

  const [favorites, setFavorites] = useState<Quiz[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredFavorites, setFilteredFavorites] = useState<Quiz[]>([])

  useEffect(() => {
    // Get favorites from store
    const favs = getFavorites()
    setFavorites(favs)
    setFilteredFavorites(favs)
  }, [getFavorites])

  // Filter favorites based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredFavorites(favorites)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = favorites.filter(
      (quiz) =>
        quiz.title.toLowerCase().includes(query) ||
        quiz.description.toLowerCase().includes(query) ||
        quiz.category.toLowerCase().includes(query),
    )

    setFilteredFavorites(filtered)
  }, [searchQuery, favorites])

  // Remove from favorites
  const handleRemoveFavorite = (quizId: string) => {
    toggleFavorite(quizId)
    setFavorites((prev) => prev.filter((quiz) => quiz.id !== quizId))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center">
          <Button variant="outline" onClick={() => router.push("/")} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-3xl font-bold flex items-center">
            <Bookmark className="mr-2 h-6 w-6 text-green-600" /> Your Favorite Quizzes
          </h1>
        </div>

        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search your favorites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {filteredFavorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col">
                  <CardHeader className="relative pb-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-4"
                      onClick={() => handleRemoveFavorite(quiz.id)}
                      aria-label="Remove from favorites"
                    >
                      <BookmarkCheck className="h-5 w-5 text-green-600" />
                    </Button>
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
            <Bookmark className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {searchQuery
                ? "No favorites match your search."
                : "Bookmark your favorite quizzes to find them easily later."}
            </p>
            <Button onClick={() => router.push("/")} className="bg-green-600 hover:bg-green-700">
              Explore Quizzes
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

