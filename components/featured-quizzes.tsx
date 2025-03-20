import { getFeaturedQuizzes } from "@/lib/quiz-service"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Trophy, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function FeaturedQuizzes() {
  const featuredQuizzes = await getFeaturedQuizzes()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {featuredQuizzes.map((quiz) => (
        <Card key={quiz.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">{quiz.title}</CardTitle>
              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
                {quiz.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{quiz.description}</p>
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Trophy className="h-4 w-4 mr-1" />
                <span>{quiz.completions} completions</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{quiz.avgRating.toFixed(1)} avg. rating</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/quiz/${quiz.id}`} className="w-full">
              <Button variant="outline" className="w-full">
                Take Quiz <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

