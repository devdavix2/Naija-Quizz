import { getQuizCategories } from "@/lib/quiz-service"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Award, History, Music, Utensils, MapPin, MessageSquare } from "lucide-react"

export default async function QuizCategoryGrid() {
  const categories = await getQuizCategories()

  // Map category IDs to appropriate icons
  const getCategoryIcon = (id: string) => {
    const icons: Record<string, any> = {
      "nigerian-culture": Award,
      "nigerian-history": History,
      "nigerian-food": Utensils,
      "nigerian-music": Music,
      "nigerian-slang": MessageSquare,
      "nigerian-geography": MapPin,
    }

    return icons[id] || Award
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Quiz Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {categories.map((category) => {
          const Icon = getCategoryIcon(category.id)
          return (
            <Card key={category.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-40 bg-gradient-to-r from-green-500 to-green-700 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon className="h-16 w-16 text-white opacity-50" />
                </div>
              </div>
              <CardHeader>
                <CardTitle>{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {category.questionCount} questions • {Math.ceil(category.timeLimit / 60)} mins
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/quiz/${category.id}`} className="w-full">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Start Quiz <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

