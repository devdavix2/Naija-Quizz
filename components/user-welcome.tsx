import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getUserStats } from "@/lib/user-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Award, BarChart3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export async function UserWelcome() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return null
  }

  const stats = await getUserStats(session.user.id)

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Welcome back, {session.user.name?.split(" ")[0] || "User"}!</CardTitle>
        <CardDescription>Continue your Nigerian culture journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Your Stats</h3>
              <BarChart3 className="h-5 w-5 text-green-600" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Quizzes Completed</p>
                <p className="text-2xl font-bold">{stats.quizzesCompleted}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Score</p>
                <p className="text-2xl font-bold">{stats.averageScore}%</p>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Your Badges</h3>
              <Award className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex flex-wrap gap-2">
              {stats.badges.length > 0 ? (
                stats.badges.map((badge, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                  >
                    {badge}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">Complete quizzes to earn badges!</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Link href="/profile">
            <Button variant="outline">View Profile</Button>
          </Link>
          <Link href="/recommendations">
            <Button className="bg-green-600 hover:bg-green-700">Recommended Quizzes</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

